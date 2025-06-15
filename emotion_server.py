from fastapi import FastAPI, Request
from pydantic import BaseModel
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS from your Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict this in prod to your frontend URL
    allow_methods=["POST"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    text: str

# Load the transformers emotion classifier once on startup
emotion_classifier = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", return_all_scores=True)

@app.post("/detect_emotions")
async def detect_emotions(req: TextRequest):
    text = req.text
    result = emotion_classifier(text)[0]  # list of dicts with label & score

    # Sort by score descending and take top 3
    top_emotions = sorted(result, key=lambda x: x['score'], reverse=True)[:3]

    # Filter out emotions with very low scores (optional)
    filtered = [e['label'] for e in top_emotions if e['score'] > 0.1]

    # Return top 3 or default Neutral if none
    if not filtered:
        filtered = ["Neutral"]

    return {"emotions": filtered}
