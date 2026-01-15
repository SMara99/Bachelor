# Standard Library Imports
import os
from pathlib import Path
from typing import List, Dict

# Deep Learning Imports
import torch
from PIL import Image
import numpy as np

# CLIP model 
from transformers import CLIPProcessor, CLIPModel

# Qdrant Client Imports
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct

# Create Client
qdrant_client = QdrantClient(host="localhost", port=6333)

class EmbeddingGenerator:
    """Class to generate and store CLIP embeddings for animal images."""
    def __init__(self, model_name: str = "openai/clip-vit-base-patch32"):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = CLIPModel.from_pretrained(model_name).to(self.device)
        self.processor = CLIPProcessor.from_pretrained(model_name)
        self.embedding_dim = 512  # CLIP base model embedding dimension

    def generate_embedding(self, image_path: str) -> np.ndarray:
        """Generate CLIP embedding for a single image."""
        image = Image.open(image_path).convert("RGB")
        inputs = self.processor(images=image, return_tensors="pt").to(self.device)
        with torch.no_grad():
            embedding = self.model.get_image_features(**inputs)
        embedding = embedding.cpu().numpy().flatten()
        return embedding

    def store_embedding(self, image_path: str, category: str, point_id: int):
        # Generate the embedding
        embedding = self.generate_embedding(image_path)
        # Create payload with metadata
        payload = {
            "image_path": image_path,
            "filename": Path(image_path).name
        }
        # Add category if provided
        if category:
            payload["category"] = category
        # Create point structure
        point = PointStruct(
            id=point_id,
            vector=embedding.tolist(),
            payload=payload
        )
        # Upload single point to Qdrant
        qdrant_client.upsert(
            collection_name="animal_images",
            points=[point]  # Still needs to be a list, even for single point
        )
    # Search similar
    def search_similar(self, image_path: str) -> int:
        """Search for the most similar image in Qdrant given an input image."""
        embedding = self.generate_embedding(image_path)
        search_result = qdrant_client.query_points(
            collection_name="animal_images",
            query=embedding.tolist(),
            limit=1
        )
        if search_result.points:
            return search_result.points[0].id
        else:
            return -1
            
# Example usage
embedding_generator = EmbeddingGenerator()
test = embedding_generator.search_similar("C:\\DataSet\\animals\\animals\\dog\\dog_1.jpg")
print(f"Most similar image ID: {test}")
