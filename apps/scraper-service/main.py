from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import grpc
import os
from typing import List
import aiohttp
from bs4 import BeautifulSoup
import logging

app = FastAPI(title="Scraper Service")

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

@app.get("/")
async def root():
    return {"message": "Scraper Service is running"}

@app.post("/scrape/url")
async def scrape_url(url: str):
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status != 200:
                    raise HTTPException(status_code=400, detail="Failed to fetch URL")
                
                html = await response.text()
                soup = BeautifulSoup(html, 'lxml')
                
                # Remove script and style elements
                for script in soup(["script", "style"]):
                    script.decompose()
                
                # Get text content
                text = soup.get_text()
                
                # Clean up text
                lines = (line.strip() for line in text.splitlines())
                chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
                text = ' '.join(chunk for chunk in chunks if chunk)
                
                return {
                    "url": url,
                    "content": text,
                    "title": soup.title.string if soup.title else None
                }
    except Exception as e:
        logger.error(f"Error scraping URL {url}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/scrape/document")
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
    uvicorn.run(app, host="0.0.0.0", port=5000) 