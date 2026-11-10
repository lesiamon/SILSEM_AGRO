import {
  ArrowRight,
  CalendarDays,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CloudUpload,
  FlaskConical,
  ImagePlus,
  Info,
  Leaf,
  LoaderCircle,
  MapPin,
  Menu,
  Microscope,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Sprout,
  Ticket,
  X,
} from "lucide-react";
import { ChangeEvent, DragEvent, ReactNode, useEffect, useRef, useState } from "react";

type AnalysisResult = {
  class: string;
  confidence: number;
  ai_feedback?: string;
};

type Fungicide = {
  name: string;
  ingredients: string;
  mode: string;
  manufacturer: string;
  image: string;
};

const fieldStories = [
  {
    eyebrow: "Field intelligence",
    title: "Read the crop before the symptoms spread.",
    description:
      "Regular scouting turns subtle leaf changes into an early warning system for the whole field.",
    image:
      "https://images.unsplash.com/photo-1704785119724-bfe083ee5373?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=85&w=1600",
    alt: "A healthy potato field with green leaves and white flowers",
    credit: "Photo by Gautam Ganguly",
  },
  {
    eyebrow: "Crop care",
    title: "Healthy foliage starts with consistent observation.",
    description:
      "Track moisture, canopy density, and lower-leaf health to spot disease pressure before it accelerates.",
    image:
      "https://images.unsplash.com/photo-1624205001508-38a3bb94b766?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=85&w=1600",
    alt: "Close-up view of healthy green crop leaves",
    credit: "Photo by Alex Gagareen",
  },
  {
    eyebrow: "Season planning",
    title: "Pair fast diagnosis with informed field action.",
    description:
      "Use every scan as a decision point—then confirm treatment choices with your local crop adviser.",
    image:
      "https://images.unsplash.com/photo-1752647026554-b446da497538?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=85&w=1600",
    alt: "Green potato plants growing in a garden",
    credit: "Photo by Екатерина Коробова",
  },
];

const upcomingEvents = [
  {
    date: "18",
    month: "Sep",
    type: "Field day",
    title: "Potato Crop Health Walk",
    description:
      "Join growers and plant-health specialists for a practical morning of canopy scouting, symptom recognition, and field-side diagnosis.",
    location: "Highland Demonstration Farm",
    time: "08:30–12:00",
    image:
      "https://images.unsplash.com/photo-1635174815483-81657b67ec48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=85&w=1600",
    alt: "A farmer standing beside agricultural equipment in a field",
    credit: "Photo by Darla Hueske",
  },
  {
    date: "04",
    month: "Oct",
    type: "Workshop",
    title: "Early Blight Action Lab",
    description:
      "A hands-on session covering image capture, diagnosis confidence, treatment timing, and resistance-aware field planning.",
    location: "SILSEM Learning Barn",
    time: "10:00–14:30",
    image:
      "https://images.unsplash.com/photo-1779205143604-58fd8954ea76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=85&w=1600",
    alt: "A blue tractor moving through a dusty field",
    credit: "Photo by Chris Bischoff",
  },
  {
    date: "12",
    month: "Nov",
    type: "Expo",
    title: "Future Farm Technology Day",
    description:
      "Meet local innovators and explore practical tools for crop imaging, precision spraying, and data-led farm decisions.",
    location: "Regional Growers Pavilion",
    time: "09:00–16:00",
    image:
      "https://images.unsplash.com/photo-1680033786474-58d0a84e2d5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=85&w=1600",
    alt: "Rows of tractors at an agricultural exhibition",
    credit: "Photo by Gene Gallin",
  },
];

const fungicides: Record<"early" | "late", Fungicide[]> = {
  early: [
    {
      name: "Azoxystrobin",
      ingredients: "Azoxystrobin",
      mode: "Systemic",
      manufacturer: "Syngenta",
      image:
        "https://www.albaugh.com/images/unitedstateslibraries/productimages/seed-treatment/albaugh_1gal_azoxystrobin100st.png?sfvrsn=7114137e_1",
    },
    {
      name: "Difenoconazole",
      ingredients: "Difenoconazole",
      mode: "Systemic",
      manufacturer: "Corteva",
      image: "https://www.bestagrolife.com/img/d-zole.webp",
    },
    {
      name: "Mancozeb",
      ingredients: "Mancozeb",
      mode: "Contact",
      manufacturer: "BASF",
      image: "https://aljayplantingdreams.com/wp-content/uploads/2017/04/Mancozeb-web.png",
    },
    {
      name: "Copper Hydroxide",
      ingredients: "Copper Hydroxide",
      mode: "Contact",
      manufacturer: "Syngenta",
      image:
        "https://www.grosafe.co.nz/wp-content/uploads/2022/05/Hortcare-Copper-Hydroxide-10kg-Bag.png",
    },
    {
      name: "Chlorothalonil",
      ingredients: "Chlorothalonil",
      mode: "Contact",
      manufacturer: "Syngenta",
      image:
        "https://www.controlsolutionsinc.com/hs-fs/hubfs/jug_Chlorothalonil720F_EN_2022.png?width=560&height=703&name=jug_Chlorothalonil720F_EN_2022.png",
    },
  ],
  late: [
    {
      name: "Metalaxyl + Mancozeb",
      ingredients: "Metalaxyl, Mancozeb",
      mode: "Systemic & contact",
      manufacturer: "FMC",
      image:
        "https://image.made-in-china.com/202f0j00PCyodNbWGsqG/Fungicide-Metalaxyl-M-Mancozeb-68-Wg-for-Downy-Phytophthora.webp",
    },
    {
      name: "Fluopicolide + Propamocarb",
      ingredients: "Fluopicolide, Propamocarb",
      mode: "Systemic",
      manufacturer: "Bayer",
      image:
        "https://www.unkrautvernichter-shop.de/images/product_images/popup_images/Infinito-1-Liter-Propamocarb-Fluopicolide_461.jpg",
    },
    {
      name: "Cymoxanil + Mancozeb",
      ingredients: "Cymoxanil, Mancozeb",
      mode: "Systemic & contact",
      manufacturer: "Adama",
      image:
        "https://5.imimg.com/data5/SELLER/Default/2021/5/FX/MO/EQ/96410225/cymoxanil-8-mancozeb-64-wp.png",
    },
    {
      name: "Mandipropamid",
      ingredients: "Mandipropamid",
      mode: "Systemic",
      manufacturer: "Syngenta",
      image:
        "https://5.imimg.com/data5/DF/XL/EU/GLADMIN-115669/revus-mandipropamid-25-sc-fungicide.jpg",
    },
    {
      name: "Dimethomorph",
      ingredients: "Dimethomorph",
      mode: "Systemic",
      manufacturer: "BASF",
      image: "https://cdn.globalso.com/tangagri/Dimethomorph-2.png",
    },
  ],
};

function renderInline(text: string) {
  return text.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

function FormattedFeedback({ text }: { text: string }) {
  return (
    <div className="feedback-copy">
      {text.split("\n").map((rawLine, index) => {
        const line = rawLine.trim();
        if (!line) return <div className="feedback-space" key={index} />;
        if (line.startsWith("### ")) {
          return <h4 key={index}>{renderInline(line.slice(4))}</h4>;
        }
        if (line.startsWith("**") && line.endsWith("**")) {
          return <h5 key={index}>{renderInline(line)}</h5>;
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <div className="feedback-list-item" key={index}>
              <Check size={15} aria-hidden="true" />
              <p>{renderInline(line.slice(2))}</p>
            </div>
          );
        }
        if (/^\d+\.\s/.test(line)) {
          const [number] = line.match(/^\d+/) ?? [""];
          return (
            <div className="feedback-step" key={index}>
              <span>{number}</span>
              <p>{renderInline(line.replace(/^\d+\.\s*/, ""))}</p>
            </div>
          );
        }
        return <p key={index}>{renderInline(line)}</p>;
      })}
    </div>
  );
}

function StatusIcon({ state }: { state: "empty" | "loading" | "error" | "result" }) {
  const icons: Record<typeof state, ReactNode> = {
    empty: <Microscope size={28} />,
    loading: <LoaderCircle className="spin" size={28} />,
    error: <CircleAlert size={28} />,
    result: <ShieldCheck size={28} />,
  };
  return <div className={`status-icon status-icon--${state}`}>{icons[state]}</div>;
}

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeStory, setActiveStory] = useState(0);
  const [activeEvent, setActiveEvent] = useState(0);
  const [activeTreatment, setActiveTreatment] = useState<"early" | "late">("early");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    const timer = window.setInterval(
      () => setActiveStory((current) => (current + 1) % fieldStories.length),
      7000,
    );
    return () => window.clearInterval(timer);
  }, []);

  const analyzeFile = async (file: File) => {
    setIsLoading(true);
    setData(null);
    setErrorMessage(null);
    const formData = new FormData();
    formData.append("file", file);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 45000);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/predict";
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || payload?.error) {
        throw new Error(payload?.error || `Analysis service returned ${response.status}`);
      }
      setData(payload as AnalysisResult);
    } catch (error) {
      setErrorMessage(
        error instanceof DOMException && error.name === "AbortError"
          ? "The analysis took too long. Check the service and try again."
          : error instanceof Error
            ? error.message
            : "We could not analyze this image. Check the service and try again.",
      );
    } finally {
      window.clearTimeout(timeout);
      setIsLoading(false);
    }
  };

  const acceptFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please choose a JPG, PNG, or WEBP image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Please choose an image smaller than 10 MB.");
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    void analyzeFile(file);
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    acceptFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    acceptFile(event.dataTransfer.files?.[0]);
  };

  const clearAnalysis = () => {
    if (preview) URL.revokeObjectURL(preview);
    setSelectedFile(null);
    setPreview(null);
    setData(null);
    setErrorMessage(null);
  };

  const confidence = data
    ? Math.min(100, data.confidence > 1 ? data.confidence : data.confidence * 100)
    : 0;
  const diagnosisTone = data?.class.toLowerCase().includes("healthy")
    ? "healthy"
    : data?.class.toLowerCase().includes("late")
      ? "danger"
      : "warning";

  const moveStory = (direction: number) => {
    setActiveStory((current) => (current + direction + fieldStories.length) % fieldStories.length);
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="SILSEM Agro home">
          <span className="brand-mark">
            <Leaf size={21} strokeWidth={2.4} />
          </span>
          <span>
            <strong>SILSEM</strong>
            <small>Agro intelligence</small>
          </span>
        </a>
        <nav className={mobileMenuOpen ? "nav-links nav-links--open" : "nav-links"}>
          <a href="#diagnose" onClick={() => setMobileMenuOpen(false)}>
            Diagnose
          </a>
          <a href="#field-notes" onClick={() => setMobileMenuOpen(false)}>
            Field notes
          </a>
          <a href="#events" onClick={() => setMobileMenuOpen(false)}>
            Events
          </a>
          <a href="#treatments" onClick={() => setMobileMenuOpen(false)}>
            Treatments
          </a>
        </nav>
        <a className="header-cta" href="#diagnose">
          Scan a leaf <ArrowRight size={16} />
        </a>
        <button
          className="menu-button"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">
                <span />
                AI-assisted crop health
              </div>
              <h1>
                See what your <em>leaves</em> are telling you.
              </h1>
              <p>
                Turn a single potato leaf photo into a rapid disease assessment and practical next
                steps for healthier fields.
              </p>
              <div className="hero-actions">
                <a className="primary-button" href="#diagnose">
                  <Camera size={18} />
                  Start a diagnosis
                </a>
                <a className="text-link" href="#how-it-works">
                  How it works <ArrowRight size={16} />
                </a>
              </div>
              <div className="trust-row">
                <div>
                  <strong>3</strong>
                  <span>crop conditions</span>
                </div>
                <div>
                  <strong>&lt; 1 min</strong>
                  <span>typical scan</span>
                </div>
                <div>
                  <strong>24/7</strong>
                  <span>field support</span>
                </div>
              </div>
              <span className="hero-credit">Photo by Sue Winston · Unsplash</span>
            </div>
          </div>
        </section>

        <section className="diagnostic-section" id="diagnose">
          <div className="section-heading section-heading--light">
            <div>
              <span className="section-kicker">Leaf diagnostic</span>
              <h2>From photo to field action.</h2>
            </div>
            <p>
              Use a clear, well-lit image of one potato leaf. Keep the leaf centered and fill most
              of the frame.
            </p>
          </div>

          <div className="diagnostic-workspace">
            <div className="upload-panel">
              <div className="panel-label">
                <span>01</span>
                <div>
                  <strong>Leaf sample</strong>
                  <small>JPG, PNG or WEBP · up to 10 MB</small>
                </div>
              </div>
              <input
                ref={inputRef}
                className="sr-only"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={onInputChange}
              />
              {!preview ? (
                <div
                  className={`drop-zone ${isDragging ? "drop-zone--active" : ""}`}
                  onDragEnter={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragOver={(event) => event.preventDefault()}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={onDrop}
                >
                  <div className="upload-icon">
                    <CloudUpload size={30} />
                  </div>
                  <h3>Drop your leaf image here</h3>
                  <p>Use a sharp photo with natural light and a simple background.</p>
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => inputRef.current?.click()}
                  >
                    <ImagePlus size={17} />
                    Choose image
                  </button>
                </div>
              ) : (
                <div className="preview-frame">
                  <img src={preview} alt="Selected potato leaf sample" />
                  <div className="preview-overlay">
                    <div>
                      <small>Selected sample</small>
                      <strong>{selectedFile?.name}</strong>
                    </div>
                    <button
                      type="button"
                      aria-label="Choose a different image"
                      onClick={() => inputRef.current?.click()}
                    >
                      <RefreshCw size={17} />
                      Replace
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="result-panel">
              <div className="panel-label">
                <span>02</span>
                <div>
                  <strong>Analysis</strong>
                  <small>Model assessment and confidence</small>
                </div>
              </div>

              {isLoading ? (
                <div className="analysis-state">
                  <StatusIcon state="loading" />
                  <h3>Reading leaf patterns</h3>
                  <p>Checking color, texture, and visible disease markers.</p>
                  <div className="loading-line">
                    <span />
                  </div>
                </div>
              ) : errorMessage ? (
                <div className="analysis-state analysis-state--error">
                  <StatusIcon state="error" />
                  <h3>Analysis unavailable</h3>
                  <p>{errorMessage}</p>
                  {selectedFile && (
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => void analyzeFile(selectedFile)}
                    >
                      <RefreshCw size={17} />
                      Try again
                    </button>
                  )}
                </div>
              ) : data ? (
                <div className="analysis-result">
                  <div className="result-topline">
                    <StatusIcon state="result" />
                    <span className={`diagnosis-badge diagnosis-badge--${diagnosisTone}`}>
                      {diagnosisTone === "healthy" ? "No disease detected" : "Disease detected"}
                    </span>
                  </div>
                  <small>Likely diagnosis</small>
                  <h3>{data.class}</h3>
                  <div className="confidence-row">
                    <span>Model confidence</span>
                    <strong>{confidence.toFixed(1)}%</strong>
                  </div>
                  <div
                    className="confidence-track"
                    role="progressbar"
                    aria-label="Model confidence"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(confidence)}
                  >
                    <span style={{ width: `${confidence}%` }} />
                  </div>
                  <p className="result-note">
                    Use this result as a screening aid. Confirm critical treatment decisions with a
                    qualified local agronomist.
                  </p>
                </div>
              ) : (
                <div className="analysis-state">
                  <StatusIcon state="empty" />
                  <h3>Your result will appear here</h3>
                  <p>Upload one potato leaf image to begin the assessment.</p>
                </div>
              )}
            </div>
          </div>

          {(data?.ai_feedback || isLoading) && (
            <div className="advisory-panel">
              <div className="advisory-heading">
                <div className="advisory-icon">
                  <Sparkles size={21} />
                </div>
                <div>
                  <span className="section-kicker">AI field guidance</span>
                  <h3>Recommended next steps</h3>
                </div>
                {data && (
                  <button className="clear-button" type="button" onClick={clearAnalysis}>
                    <X size={16} /> Clear result
                  </button>
                )}
              </div>
              {isLoading ? (
                <div className="advisory-skeleton">
                  <span />
                  <span />
                  <span />
                </div>
              ) : (
                data?.ai_feedback && <FormattedFeedback text={data.ai_feedback} />
              )}
            </div>
          )}
        </section>

        <section className="process-section" id="how-it-works">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Simple by design</span>
              <h2>Three steps to a clearer decision.</h2>
            </div>
          </div>
          <div className="process-grid">
            {[
              {
                icon: <Camera size={23} />,
                number: "01",
                title: "Capture",
                copy: "Photograph one leaf in clear, natural light.",
              },
              {
                icon: <Microscope size={23} />,
                number: "02",
                title: "Analyze",
                copy: "The model compares visible signs across three conditions.",
              },
              {
                icon: <Sprout size={23} />,
                number: "03",
                title: "Act",
                copy: "Review practical field guidance and treatment references.",
              },
            ].map((step) => (
              <article className="process-card" key={step.number}>
                <span className="process-number">{step.number}</span>
                <div className="process-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="events-section" id="events">
          <div className="events-intro">
            <div>
              <span className="section-kicker">Season 2026</span>
              <h2>Meet us where the growing happens.</h2>
            </div>
            <p>
              Field learning, practical workshops, and new ideas—designed for growers who prefer
              useful conversations over long presentations.
            </p>
          </div>

          <div className="event-docket">
            <article className="featured-event">
              <img src={upcomingEvents[activeEvent].image} alt={upcomingEvents[activeEvent].alt} />
              <div className="featured-event-shade" />
              <div className="featured-event-date">
                <strong>{upcomingEvents[activeEvent].date}</strong>
                <span>{upcomingEvents[activeEvent].month}</span>
              </div>
              <div className="featured-event-content">
                <span className="event-type">{upcomingEvents[activeEvent].type}</span>
                <h3>{upcomingEvents[activeEvent].title}</h3>
                <p>{upcomingEvents[activeEvent].description}</p>
                <div className="event-facts">
                  <span>
                    <MapPin size={15} />
                    {upcomingEvents[activeEvent].location}
                  </span>
                  <span>
                    <CalendarDays size={15} />
                    {upcomingEvents[activeEvent].time}
                  </span>
                </div>
                <small>{upcomingEvents[activeEvent].credit} · Unsplash</small>
              </div>
            </article>

            <div className="event-tickets">
              <div className="event-tickets-heading">
                <Ticket size={20} />
                <div>
                  <strong>Upcoming events</strong>
                  <span>Choose an event to preview</span>
                </div>
              </div>
              {upcomingEvents.map((event, index) => (
                <button
                  className={`event-ticket ${activeEvent === index ? "active" : ""}`}
                  type="button"
                  key={event.title}
                  onClick={() => setActiveEvent(index)}
                  aria-pressed={activeEvent === index}
                >
                  <span className="ticket-date">
                    <strong>{event.date}</strong>
                    {event.month}
                  </span>
                  <span className="ticket-copy">
                    <small>{event.type}</small>
                    <strong>{event.title}</strong>
                    <span>{event.location}</span>
                  </span>
                  <ArrowRight size={18} />
                </button>
              ))}
              <div className="event-note">
                <span />
                <p>Event details are part of the 2026 program preview.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="stories-section" id="field-notes">
          <div className="story-frame">
            <img src={fieldStories[activeStory].image} alt={fieldStories[activeStory].alt} />
            <div className="story-overlay" />
            <div className="story-content">
              <span className="section-kicker">{fieldStories[activeStory].eyebrow}</span>
              <h2>{fieldStories[activeStory].title}</h2>
              <p>{fieldStories[activeStory].description}</p>
              <small>{fieldStories[activeStory].credit} · Unsplash</small>
            </div>
            <div className="story-controls">
              <button type="button" aria-label="Previous field note" onClick={() => moveStory(-1)}>
                <ChevronLeft size={20} />
              </button>
              <div className="story-dots">
                {fieldStories.map((story, index) => (
                  <button
                    type="button"
                    className={activeStory === index ? "active" : ""}
                    aria-label={`Show ${story.title}`}
                    key={story.title}
                    onClick={() => setActiveStory(index)}
                  />
                ))}
              </div>
              <button type="button" aria-label="Next field note" onClick={() => moveStory(1)}>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </section>

        <section className="treatments-section" id="treatments">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Treatment reference</span>
              <h2>Know the active ingredients.</h2>
            </div>
            <p>
              A quick reference for commonly used options. Always follow the product label, local
              regulations, and resistance-management guidance.
            </p>
          </div>
          <div className="treatment-tabs" role="tablist" aria-label="Disease treatment type">
            <button
              className={activeTreatment === "early" ? "active" : ""}
              type="button"
              role="tab"
              aria-selected={activeTreatment === "early"}
              onClick={() => setActiveTreatment("early")}
            >
              Early blight
            </button>
            <button
              className={activeTreatment === "late" ? "active" : ""}
              type="button"
              role="tab"
              aria-selected={activeTreatment === "late"}
              onClick={() => setActiveTreatment("late")}
            >
              Late blight
            </button>
          </div>
          <div className="treatment-list">
            {fungicides[activeTreatment].map((item, index) => (
              <article className="treatment-row" key={item.name}>
                <span className="treatment-index">{String(index + 1).padStart(2, "0")}</span>
                <div className="treatment-name">
                  <div className="medicine-image">
                    <FlaskConical size={19} />
                    <img
                      src={item.image}
                      alt={`${item.name} fungicide product`}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.ingredients}</p>
                  </div>
                </div>
                <div className="treatment-meta">
                  <span>
                    <small>Mode</small>
                    {item.mode}
                  </span>
                  <span>
                    <small>Manufacturer</small>
                    {item.manufacturer}
                  </span>
                </div>
              </article>
            ))}
          </div>
          <div className="safety-note">
            <Info size={18} />
            <p>
              Product availability and approved uses vary by region. This is educational
              information, not a pesticide recommendation.
            </p>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <span className="brand-mark">
            <Leaf size={21} />
          </span>
          <div>
            <strong>SILSEM Agro</strong>
            <p>Practical intelligence for healthier fields.</p>
          </div>
        </div>
        <p>© {new Date().getFullYear()} SILSEM Agro. Built for better crop decisions.</p>
      </footer>
    </div>
  );
}
