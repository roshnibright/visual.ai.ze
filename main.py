from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from model_call import char_prediction, word_prediction
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",  # frontend dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,              # or ["*"] for all
    allow_credentials=True,
    allow_methods=["*"],                # or ["POST", "GET", "OPTIONS"]
    allow_headers=["*"],                # or ["Content-Type"]
)






class CharInput(BaseModel):
    text: str


class WordInput(BaseModel):
    text: str
    word_list: List[str]


@app.post("/predict-char")
def predict_char(data: CharInput):
    try:
        return char_prediction(data.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict-word")
def predict_word(data: WordInput):
    try:
        return word_prediction(data.text, data.word_list)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
