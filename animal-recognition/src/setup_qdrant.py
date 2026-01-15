# Qdrant Client Imports
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance

class QdrantSetup:
    """Class to setup Qdrant vector database for animal image recognition using CLIP embeddings."""
    def __init__(self, qdrant_host: str = "localhost", qdrant_port: int = 6333):
        self.client = QdrantClient(host=qdrant_host, port=qdrant_port)
        self.embedding_dim = 512 

qdrant = QdrantSetup()
