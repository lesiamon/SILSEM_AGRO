import os
import sys
import threading
from pathlib import Path

# Suppress TensorFlow logging & force CPU operation for consistency
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
os.environ["TF_USE_PLUGGABLE_DEVICE"] = "0"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

from io import BytesIO
import json
import numpy as np
from PIL import Image
import requests
import uvicorn
from fastapi import FastAPI, File, UploadFile, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tensorflow as tf

# Load environment variables with fallback
BASE_DIR = Path(__file__).resolve().parent.parent
env_candidates = [
    Path(__file__).resolve().parent / ".env",
    BASE_DIR / ".env",
    BASE_DIR / "frontend" / ".env",
]

try:
    from dotenv import load_dotenv
    for env_file in env_candidates:
        if env_file.exists():
            load_dotenv(dotenv_path=env_file)
except ImportError:
    for env_file in env_candidates:
        if env_file.exists():
            with open(env_file, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "").strip()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "").strip()

app = FastAPI(
    title="SILSEM Agro Disease Detection API",
    description="Potato Leaf Disease Classification & AI Agricultural Recommendations",
    version="2.1.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model locator and manager
MODEL_PATHS = [
    BASE_DIR / "saved_models" / "2.h5",
    BASE_DIR / "saved_models" / "2.keras",
    BASE_DIR / "saved_models" / "2 _fixed.h5",
    BASE_DIR / "training" / "potatoes.h5",
]

MODEL = None
_model_lock = threading.Lock()

def get_model():
    """Retrieve or load the TensorFlow model with thread safety."""
    global MODEL
    if MODEL is None:
        with _model_lock:
            if MODEL is None:
                for candidate in MODEL_PATHS:
                    if candidate.exists():
                        try:
                            print(f"Loading model from: {candidate}")
                            MODEL = tf.keras.models.load_model(str(candidate))
                            print(f"Successfully loaded model from: {candidate}")
                            break
                        except Exception as err:
                            print(f"Failed candidate {candidate}: {err}")
    return MODEL

@app.on_event("startup")
def preload_model():
    """Pre-warm the model in the background so initial server boot is near-instant."""
    threading.Thread(target=get_model, daemon=True).start()

CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

# Structured agricultural advice dictionary
STRUCTURED_TREATMENT_PLANS = {
    "Early Blight": {
        "severity": "moderate",
        "overview": "Alternaria solani causes brown concentric 'target' rings on foliage. Moderate urgency; manage promptly before lower leaf defoliation accelerates.",
        "immediate_actions": [
            "Prune off heavily spotted lower leaves and burn or bury them away from the field.",
            "Cease overhead sprinkler watering; switch to ground/drip irrigation to avoid damp leaves.",
            "Clean and sanitize pruning shears and field tools between rows."
        ],
        "fungicides": [
            "Azoxystrobin (Systemic)",
            "Difenoconazole (Systemic)",
            "Mancozeb 75% WP (Contact)",
            "Copper Hydroxide (Protectant)",
            "Chlorothalonil (Contact)"
        ],
        "application": "Spray protectant fungicide (Mancozeb or Copper) immediately. Rotate with systemic Difenoconazole or Azoxystrobin every 7-10 days in warm, humid weather.",
        "prevention": [
            "Practice a 3-4 year rotation without solanaceous crops (potatoes, tomatoes, peppers).",
            "Use certified disease-free, high-vigor seed tubers.",
            "Maintain optimal row spacing (60-75 cm) for canopy aeration and rapid leaf drying."
        ],
        "consult_expert": False
    },
    "Late Blight": {
        "severity": "severe",
        "overview": "Phytophthora infestans is an aggressive water mold capable of wiping out entire fields within days under cool, humid conditions. IMMEDIATE ACTION REQUIRED.",
        "immediate_actions": [
            "Immediately rogue out and destroy severely blighted plants to eliminate spore reservoirs.",
            "Avoid entering damp fields to prevent carrying millions of sporangia on clothes/equipment.",
            "Inspect neighboring potato and tomato fields upwind for infection signs."
        ],
        "fungicides": [
            "Metalaxyl + Mancozeb (Ridomil Gold)",
            "Fluopicolide + Propamocarb (Infinito)",
            "Cymoxanil + Mancozeb",
            "Mandipropamid (Revus)",
            "Dimethomorph"
        ],
        "application": "Apply systemic dual-action spray (e.g. Metalaxyl + Mancozeb) immediately. Under continuous wet or foggy weather (15-20°C), repeat sprays every 5-7 days.",
        "prevention": [
            "Plant blight-tolerant or resistant potato cultivars.",
            "Ensure excellent field drainage to prevent water pooling around root zones.",
            "Eliminate volunteer potato plants and cull piles before the planting season."
        ],
        "consult_expert": True
    },
    "Healthy": {
        "severity": "healthy",
        "overview": "Foliage exhibits vigorous chlorophyll development with no necrotic lesions or mold. Focus on preventive health and crop nutrition.",
        "immediate_actions": [
            "Conduct routine scouting twice weekly, focusing on lower canopy leaves.",
            "Check soil moisture and ensure even, regular watering at base.",
            "Verify adequate potassium and phosphorus levels in soil tests."
        ],
        "fungicides": [
            "Preventive Copper Hydroxide (low dose)",
            "Bio-fungicide Bacillus subtilis",
            "Organic Neem Oil Extract"
        ],
        "application": "No curative chemical application required. Preventive bio-protectant spray may be applied prior to forecast rainy spells.",
        "prevention": [
            "Avoid excessive nitrogen which causes soft, lush foliage prone to fungal attack.",
            "Keep field margins free of solanaceous weeds (e.g., nightshades).",
            "Maintain consistent scouting records."
        ],
        "consult_expert": False
    }
}

# Legacy text advice matrix fallback
OFFLINE_EXPERT_ADVICE = {
    "Early Blight": (
        "### 🔬 Diagnosis: Early Blight (Alternaria solani)\n\n"
        "**Key Symptoms:**\n"
        "- Dark brown to black circular lesions with characteristic concentric rings ('target-board' pattern).\n"
        "- Symptoms typically start on the lower, older leaves and cause surrounding tissue to yellow.\n\n"
        "**Immediate Action Plan:**\n"
        "1. **Sanitation:** Prune and safely dispose of heavily infected lower foliage; do not compost infected debris.\n"
        "2. **Water Management:** Switch to drip irrigation or water at the base of plants early in the morning.\n\n"
        "**Recommended Fungicides:**\n"
        "- **Systemic:** *Azoxystrobin* or *Difenoconazole* for curative control.\n"
        "- **Contact / Protectant:** *Mancozeb* or *Copper Hydroxide* / *Chlorothalonil* applied at 7-10 day intervals.\n\n"
        "**Long-Term Prevention:**\n"
        "- Practice a 3 to 4-year crop rotation avoiding Solanaceae crops.\n"
        "- Use certified disease-resistant seed tubers."
    ),
    "Late Blight": (
        "### ⚠️ Diagnosis: Late Blight (Phytophthora infestans) - HIGH PRIORITY\n\n"
        "**Key Symptoms:**\n"
        "- Water-soaked, pale-to-dark green or brownish-black lesions on leaves and stems.\n"
        "- In damp or humid conditions, a delicate white fuzzy fungal growth appears on leaf undersides.\n"
        "- Spreads very rapidly and can destroy an entire field within days if unmanaged.\n\n"
        "**Immediate Action Plan:**\n"
        "1. **Isolate & Remove:** Rogue out and burn or bury severely infested plants immediately.\n"
        "2. **Halt Overhead Irrigation:** Keep the canopy as dry as possible.\n\n"
        "**Recommended Fungicides:**\n"
        "- **Systemic & Contact Dual Action:** *Metalaxyl + Mancozeb* or *Cymoxanil + Mancozeb* applied immediately.\n"
        "- **Advanced Systemic:** *Fluopicolide + Propamocarb* or *Mandipropamid*.\n"
        "- Re-spray every 5-7 days under wet, cool weather conditions.\n\n"
        "**Long-Term Prevention:**\n"
        "- Plant certified clean, blight-tolerant potato varieties.\n"
        "- Ensure good field drainage and avoid low-lying frost pockets."
    ),
    "Healthy": (
        "### 🌱 Diagnosis: Healthy Potato Foliage\n\n"
        "**Condition:**\n"
        "- Leaf tissue displays uniform green coloration with no visible signs of fungal blights or mold.\n\n"
        "**Maintenance & Preventive Recommendations:**\n"
        "1. **Balanced Nutrition:** Avoid excessive nitrogen fertilization, which produces overly dense, soft foliage.\n"
        "2. **Scouting:** Inspect the underside of leaves twice weekly.\n"
        "3. **Protective Measures:** Consider preventive biostimulant sprays or mild bio-fungicides (*Bacillus subtilis*)."
    )
}

def get_ai_feedback(predicted_class: str, confidence: float) -> str:
    """Fetch AI advice from DeepSeek/OpenAI if API keys exist, otherwise fall back to curated expert advice."""
    if DEEPSEEK_API_KEY:
        try:
            headers = {
                "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
                "Content-Type": "application/json"
            }
            prompt = (
                f"You are a professional plant pathologist and agricultural consultant for potato farming in East Africa. "
                f"A potato leaf has been diagnosed with '{predicted_class}' with {confidence * 100:.1f}% confidence. "
                f"Provide concise, structured, actionable advice for the farmer: "
                f"1. Symptoms & Severity. 2. Immediate Cultural/Field Actions. 3. Recommended Chemical/Fungicide treatments with active ingredients. 4. Prevention. "
                f"Format cleanly in markdown."
            )
            data = {
                "model": "deepseek-chat",
                "messages": [
                    {"role": "system", "content": "You are an agricultural expert specializing in potato crop pathology."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.5,
                "max_tokens": 500
            }
            res = requests.post("https://api.deepseek.com/v1/chat/completions", headers=headers, json=data, timeout=8)
            if res.status_code == 200:
                result = res.json()["choices"][0]["message"]["content"]
                if result and len(result.strip()) > 20:
                    return result
        except Exception as e:
            print(f"DeepSeek API call skipped/failed: {e}")

    if OPENAI_API_KEY:
        try:
            headers = {
                "Authorization": f"Bearer {OPENAI_API_KEY}",
                "Content-Type": "application/json"
            }
            data = {
                "model": "gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": "You are an agricultural expert specializing in potato crop pathology."},
                    {"role": "user", "content": f"Provide concise actionable management advice for potato plant diagnosed with {predicted_class}."}
                ],
                "max_tokens": 400
            }
            res = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=data, timeout=8)
            if res.status_code == 200:
                result = res.json()["choices"][0]["message"]["content"]
                if result and len(result.strip()) > 20:
                    return result
        except Exception as e:
            print(f"OpenAI API call skipped/failed: {e}")

    return OFFLINE_EXPERT_ADVICE.get(
        predicted_class,
        f"Plant classified as {predicted_class}. Monitor crop closely and maintain proper field hygiene."
    )

def read_file_as_image(data: bytes) -> np.ndarray:
    """Read image bytes, convert to RGB, and resize to (256, 256) matching model requirements."""
    image = Image.open(BytesIO(data)).convert("RGB")
    image = image.resize((256, 256))
    return np.array(image)

@app.get("/")
@app.get("/ping")
async def ping():
    return {
        "status": "online",
        "service": "SILSEM Agro Analytics API",
        "model_loaded": MODEL is not None,
        "classes": CLASS_NAMES
    }

class TreatmentRequest(BaseModel):
    disease: str

async def _treatment_logic(disease: str):
    """Shared logic for GET and POST /treatment."""
    norm = disease.strip().lower()
    matched_key = None
    for k in STRUCTURED_TREATMENT_PLANS:
        if k.lower() in norm or norm in k.lower():
            matched_key = k
            break

    if matched_key:
        plan = STRUCTURED_TREATMENT_PLANS[matched_key].copy()
        plan["disease"] = matched_key
        return plan

    # Generic fallback
    return {
        "disease": disease,
        "severity": "moderate",
        "overview": f"Management advisory for {disease} in agricultural crops.",
        "immediate_actions": [
            "Isolate infected plant sections and remove necrotic tissue.",
            "Avoid overhead irrigation to minimize leaf moisture.",
            "Sanitize all cutting tools and equipment."
        ],
        "fungicides": [
            "Broad-spectrum Copper Hydroxide",
            "Mancozeb 75% WP",
            "Bio-protectant Bacillus subtilis"
        ],
        "application": "Apply protective fungicide according to label directions at early morning or evening hours.",
        "prevention": [
            "Practice proper crop rotation.",
            "Ensure wide plant spacing for canopy airflow.",
            "Use certified pathogen-free planting material."
        ],
        "consult_expert": True
    }

@app.post("/treatment")
async def post_treatment(body: TreatmentRequest):
    """Return structured treatment protocol via POST body (React UI)."""
    return await _treatment_logic(body.disease)

@app.get("/treatment")
async def get_treatment(disease: str = Query(..., description="Disease name, e.g. Early Blight")):
    """Return a complete structured treatment protocol for a given crop disease (query param)."""
    return await _treatment_logic(disease)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    model = get_model()
    if model is None:
        return {
            "error": "Model is not loaded on the server. Please check model files in saved_models."
        }, 500

    try:
        image_data = await file.read()
        image = read_file_as_image(image_data)

        # Batch dimension: shape becomes (1, 256, 256, 3)
        img_batch = np.expand_dims(image, axis=0)

        predictions = model.predict(img_batch)
        pred_idx = int(np.argmax(predictions[0]))
        predicted_class = CLASS_NAMES[pred_idx]
        confidence = float(np.max(predictions[0]))

        print(f"Prediction: {predicted_class} (Confidence: {confidence * 100:.2f}%)")

        all_predictions = [
            {"label": CLASS_NAMES[i], "score": float(predictions[0][i]) * 100}
            for i in range(len(CLASS_NAMES))
        ]
        all_predictions.sort(key=lambda x: x["score"], reverse=True)

        feedback = get_ai_feedback(predicted_class, confidence)
        treatment_plan = STRUCTURED_TREATMENT_PLANS.get(predicted_class)

        return {
            "class": predicted_class,
            "disease": predicted_class,
            "confidence": confidence,
            "all_predictions": all_predictions,
            "treatment_plan": treatment_plan,
            "ai_feedback": feedback
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": str(e)}, 500

if __name__ == "__main__":
    print("=" * 60)
    print("Starting SILSEM Agro FastAPI Server")
    print("Endpoint: http://localhost:8000")
    print("Docs:     http://localhost:8000/docs")
    print("=" * 60)
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
