from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import spacy
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import wordnet
from transformers import pipeline
import logging
import os

app = FastAPI(title="NLP Service")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
nlp = spacy.load("en_core_web_sm")
sentiment_analyzer = pipeline("sentiment-analysis")
question_answering = pipeline("question-answering")

class MessageRequest(BaseModel):
    message: str
    bot_id: str
    context: List[str] = []

class IntentRequest(BaseModel):
    message: str
    bot_id: str

@app.get("/")
async def root():
    return {"message": "NLP Service is running"}

@app.post("/detect-intent")
async def detect_intent(request: IntentRequest):
    try:
        # Process the message with spaCy
        doc = nlp(request.message.lower())
        
        # Extract key information
        entities = [ent.text for ent in doc.ents]
        pos_tags = [(token.text, token.pos_) for token in doc]
        
        # Simple intent detection based on keywords
        intents = {
            "greeting": ["hello", "hi", "hey", "greetings"],
            "farewell": ["bye", "goodbye", "see you", "farewell"],
            "thanks": ["thank", "thanks", "appreciate"],
            "help": ["help", "support", "assist"],
            "question": ["what", "when", "where", "who", "why", "how"]
        }
        
        detected_intent = None
        for intent, keywords in intents.items():
            if any(keyword in request.message.lower() for keyword in keywords):
                detected_intent = intent
                break
        
        return {
            "bot_id": request.bot_id,
            "message": request.message,
            "intent": detected_intent,
            "entities": entities,
            "pos_tags": pos_tags
        }
    except Exception as e:
        logger.error(f"Error detecting intent: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/process-message")
async def process_message(request: MessageRequest):
    try:
        # Detect intent
        intent_response = await detect_intent(IntentRequest(
            message=request.message,
            bot_id=request.bot_id
        ))
        
        # If we have a clear intent, handle it directly
        if intent_response["intent"]:
            return {
                "bot_id": request.bot_id,
                "message": request.message,
                "response": handle_intent(intent_response["intent"]),
                "intent": intent_response["intent"]
            }
        
        # If we have context, try to answer the question
        if request.context:
            # Use question answering model
            qa_input = {
                "question": request.message,
                "context": " ".join(request.context)
            }
            qa_result = question_answering(qa_input)
            
            return {
                "bot_id": request.bot_id,
                "message": request.message,
                "response": qa_result["answer"],
                "confidence": qa_result["score"]
            }
        
        # If no intent and no context, return a generic response
        return {
            "bot_id": request.bot_id,
            "message": request.message,
            "response": "I'm not sure how to respond to that. Could you provide more context?",
            "intent": None
        }
    except Exception as e:
        logger.error(f"Error processing message: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def handle_intent(intent: str) -> str:
    responses = {
        "greeting": "Hello! How can I help you today?",
        "farewell": "Goodbye! Have a great day!",
        "thanks": "You're welcome! Is there anything else I can help you with?",
        "help": "I'm here to help! What would you like to know?",
        "question": "I'll do my best to answer your question. Could you provide more context?"
    }
    return responses.get(intent, "I'm not sure how to respond to that.")

@app.post("/analyze-sentiment")
async def analyze_sentiment(text: str):
    try:
        result = sentiment_analyzer(text)[0]
        return {
            "text": text,
            "sentiment": result["label"],
            "score": result["score"]
        }
    except Exception as e:
        logger.error(f"Error analyzing sentiment: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5002) 