from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from model_call import char_prediction, word_prediction

app = FastAPI()

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
