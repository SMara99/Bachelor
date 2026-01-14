#Standard Library Imports
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
from qdrant_client.models import VectorParams, Distance, PointStruct

# Progress Bar
from tqdm import tqdm

class QdrantSetup:
    """Class to setup Qdrant vector database for animal image recognition using CLIP embeddings."""
    def __init__(self, qdrant_host: str = "localhost", qdrant_port: int = 6333):
        self.client = QdrantClient(host=qdrant_host, port=qdrant_port)
        self.embedding_dim = 512 

    def setup_collection(self):
        """Create a Qdrant collection for storing image embeddings."""
        
        self.client.create_collection(
            collection_name="animal_images",
            vectors_config=VectorParams(
            size=self.embedding_dim,
            distance=Distance.COSINE
            )
        )
        print(f"Collection 'animal_images' created successfully!")

qdrant = QdrantSetup()
qdrant.setup_collection()