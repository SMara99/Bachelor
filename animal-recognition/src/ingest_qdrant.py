from qdrant_client import QdrantClient
from pathlib import Path
from tqdm import tqdm
from embedding import EmbeddingGenerator

# Create Embedding Generator
embedder = EmbeddingGenerator()

class Ingestor:
    def __init__(self, img_dir: str, collection_name: str = "animal_images", embedder: EmbeddingGenerator = None):
        self.img_dir = img_dir
        self.collection_name = collection_name
        self.embedder = embedder if embedder is not None else EmbeddingGenerator()
        
    def _get_image_paths(self):
        """Get all image file paths from the specified directory."""
        supported_formats = ('.jpg', '.jpeg', '.png', '.bmp', '.gif')
        image_paths = [str(p) for p in Path(self.img_dir).rglob('*') if p.suffix.lower() in supported_formats]
        return image_paths
    
    def _extract_label(self, image_path: str) -> str:
        """Extract label from the image path assuming structure img_dir/category/filename."""
        parts = Path(image_path).parts
        if len(parts) >= 2:
            return parts[-2]  # Second last part is the category
        return "unknown"

    def ingest_image(self, image_path: str, point_id: int):
        """Ingest a single image into Qdrant with its embedding"""
        category = self._extract_label(image_path)
        self.embedder.store_embedding(image_path=image_path, category=category, point_id=point_id, collection_name=self.collection_name)

    def ingest_images(self):
        """Ingest images from the directory into Qdrant with embeddings"""
        image_paths = self._get_image_paths()
        for idx, img_path in enumerate(tqdm(image_paths, desc="Ingesting images")):
            category = self._extract_label(img_path)
            self.embedder.store_embedding(image_path=img_path, category=category, point_id=idx, collection_name=self.collection_name)

# Example usage:
ingestor = Ingestor(img_dir="C:\\DataSet\\animals\\animals", collection_name="animal_images", embedder=embedder)
ingestor.ingest_images()



