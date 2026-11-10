from http.client import responses
import numpy as np
from fastapi import FastAPI,File,UploadFile,File
import uvicorn
from io import BytesIO
from PIL import Image
import requests
import tensorflow as tf


app = FastAPI()

endpoint = "http://localhost:8501/v1/models/potatoes_model:predict"


CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

@app.get("/ping")
async def ping():
    return "hello , i am live lesi"

def read_file_as_image(data) -> np.ndarray:
   image = np.array(Image.open(BytesIO(data)))

   return image

@app.post("/predict")
async def predict(
        file: UploadFile = File(...)
):
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)

    json_data = {
        "instances": img_batch.tolist()

    }
    response = requests.post(endpoint, json=json_data)
    prediction = np.array(response.json()["predictions"][0])

    prediction_class = np.argmax(prediction).item()
    confidences = np.max(prediction).item()

    return {
        "class":prediction_class,
        "confidence": float(confidences)
    }

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)