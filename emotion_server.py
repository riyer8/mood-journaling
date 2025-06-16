from fastapi import FastAPI, Request # type: ignore
from pydantic import BaseModel # type: ignore
from transformers import pipeline # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    text: str

# emotion classifier used
emotion_classifier = pipeline("text-classification", model="nateraw/bert-base-uncased-emotion", return_all_scores=True)

@app.post("/detect_emotions")
async def detect_emotions(req: TextRequest):
    text = req.text
    result = emotion_classifier(text)[0]
    
    top_emotions = sorted(result, key=lambda x: x['score'], reverse=True)[:3]
    filtered = [e['label'] for e in top_emotions if e['score'] > 0.1]

    if not filtered:
        filtered = ["Neutral"]

    return {"emotions": filtered}
