# Qdrant Client Imports
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance
from typing import List, Set

class QdrantSetup:
    """Class to setup Qdrant vector database for animal image recognition using CLIP embeddings."""
    def __init__(self, qdrant_host: str = "localhost", qdrant_port: int = 6333):
        self.client = QdrantClient(host=qdrant_host, port=qdrant_port)
        self.embedding_dim = 512 

    def get_labels_from_collection(self, collection_name: str = "animal_images") -> List[str]:
        """Retrieve all unique labels/categories from the Qdrant collection."""
        # Scroll through all points in the collection
        labels: Set[str] = set()
        offset = None
        
        while True:
            # Retrieve points in batches
            result = self.client.scroll(
                collection_name=collection_name,
                limit=100,  # Batch size
                offset=offset,
                with_payload=True,
                with_vectors=False  # Don't need vectors, just metadata
            )
            
            points, offset = result
            
            # Extract categories from payloads
            for point in points:
                if point.payload and "category" in point.payload:
                    labels.add(point.payload["category"])
            
            # Break if no more points
            if offset is None:
                break
        
        return sorted(list(labels))

# Example usage:
qdrant = QdrantSetup()
labels = qdrant.get_labels_from_collection()
print(f"Found {len(labels)} unique labels: {labels}")

# qdrant = QdrantSetup()
