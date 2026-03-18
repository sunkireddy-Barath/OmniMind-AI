import os
import logging
from typing import List
try:
    import PyPDF2
except ImportError:
    PyPDF2 = None  # type: ignore
try:
    from docx import Document as DocxDocument
except ImportError:
    DocxDocument = None  # type: ignore
import csv

logger = logging.getLogger(__name__)

class DocumentService:
    @staticmethod
    def extract_text(file_path: str, filename: str) -> str:
        ext = os.path.splitext(filename)[1].lower()
        try:
            if ext == '.pdf':
                return DocumentService._extract_pdf(file_path)
            elif ext == '.docx':
                return DocumentService._extract_docx(file_path)
            elif ext == '.txt':
                return DocumentService._extract_txt(file_path)
            elif ext == '.csv':
                return DocumentService._extract_csv(file_path)
            else:
                logger.warning(f"Unsupported file extension: {ext}")
                return ""
        except Exception as e:
            logger.error(f"Error extracting text from {filename}: {e}")
            return ""

    @staticmethod
    def _extract_pdf(file_path: str) -> str:
        text = ""
        with open(file_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                text += page.extract_text() + "\n"
        return text

    @staticmethod
    def _extract_docx(file_path: str) -> str:
        doc = DocxDocument(file_path)
        return "\n".join([para.text for para in doc.paragraphs])

    @staticmethod
    def _extract_txt(file_path: str) -> str:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            return f.read()

    @staticmethod
    def _extract_csv(file_path: str) -> str:
        text = ""
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            reader = csv.reader(f)
            for row in reader:
                text += " ".join(row) + "\n"
        return text

    @staticmethod
    def chunk_text(text: str, chunk_size: int = 1000, chunk_overlap: int = 200) -> List[str]:
        if not text:
            return []
        
        chunks = []
        start = 0
        while start < len(text):
            end = start + chunk_size
            chunks.append(text[start:end])
            start += chunk_size - chunk_overlap
        return chunks

document_service = DocumentService()
