from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import numpy as np
from sentence_transformers import SentenceTransformer
import logging
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

app = FastAPI(title="Embedder Service")

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

# Database setup
DATABASE_URL = f"postgresql://{os.getenv('DB_USERNAME', 'postgres')}:{os.getenv('DB_PASSWORD', 'postgres')}@{os.getenv('DB_HOST', 'localhost')}:{os.getenv('DB_PORT', '5432')}/vector_db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define models
class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    bot_id = Column(String, index=True)
    content = Column(String)
    embedding = Column(String)  # Store as JSON string

# Create tables
Base.metadata.create_all(bind=engine)

# Load the sentence transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

class TextRequest(BaseModel):
    text: str
    bot_id: str

class BatchTextRequest(BaseModel):
    texts: List[str]
    bot_id: str

@app.get("/")
async def root():
    return {"message": "Embedder Service is running"}

@app.post("/embed")
async def create_embedding(request: TextRequest):
    try:
        # Generate embedding
        embedding = model.encode(request.text)
        
        # Store in database
        db = SessionLocal()
        try:
            doc = Document(
                bot_id=request.bot_id,
                content=request.text,
                embedding=embedding.tolist()
            )
            db.add(doc)
            db.commit()
            db.refresh(doc)
        finally:
            db.close()
        
        return {
            "bot_id": request.bot_id,
            "embedding": embedding.tolist()
        }
    except Exception as e:
        logger.error(f"Error creating embedding: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/embed/batch")
async def create_batch_embeddings(request: BatchTextRequest):
    try:
        # Generate embeddings
        embeddings = model.encode(request.texts)
        
        # Store in database
        db = SessionLocal()
        try:
            for text, embedding in zip(request.texts, embeddings):
                doc = Document(
                    bot_id=request.bot_id,
                    content=text,
                    embedding=embedding.tolist()
                )
                db.add(doc)
            db.commit()
        finally:
            db.close()
        
        return {
            "bot_id": request.bot_id,
            "embeddings": embeddings.tolist()
        }
    except Exception as e:
        logger.error(f"Error creating batch embeddings: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/search")
async def search_similar(query: str, bot_id: str, limit: int = 5):
    try:
        # Generate query embedding
        query_embedding = model.encode(query)
        
        # Search in database using vector similarity
        db = SessionLocal()
        try:
            # TODO: Implement vector similarity search using pgvector
            # For now, return dummy results
            return {
                "bot_id": bot_id,
                "query": query,
                "results": []
            }
        finally:
            db.close()
    except Exception as e:
        logger.error(f"Error searching similar texts: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
@app.get("/")
async def root():
    return {"message": "Scraper Service is running"}
async def scrape_document(file: UploadFile = File(...)):
    try:
        content = await file.read()
        
        # TODO: Implement document parsing based on file type
        # For now, just return the raw content
        return {
            "filename": file.filename,
            "content_type": file.content_type,
            "content": content.decode('utf-8', errors='ignore')
        }
    except Exception as e:
        logger.error(f"Error processing document {file.filename}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001) 