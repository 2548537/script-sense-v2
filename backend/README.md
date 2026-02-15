# Answer Sheet Evaluation System - Backend

Python Flask backend for the Answer Sheet Evaluation System with Gemini OCR integration.

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Gemini API key.

3. **Run the server:**
   ```bash
   python app.py
   ```

The server will start on `http://localhost:5000`.

## API Endpoints

### Upload Endpoints
- `POST /api/upload/question-paper` - Upload question paper
- `POST /api/upload/answer-sheet` - Upload answer sheet
- `POST /api/upload/rubric` - Upload evaluation rubric
- `GET /api/upload/files?type=<type>` - List files (type: question, answer, rubric, or all)
- `GET /api/upload/files/<id>/view?type=<type>` - View file
- `GET /api/upload/files/<id>/thumbnail?type=<type>` - Get thumbnail

### Evaluation Endpoints
- `POST /api/evaluate/transcribe` - Transcribe handwriting
- `POST /api/evaluate/extract-diagram` - Extract diagrams
- `POST /api/evaluate/marks` - Save marks
- `GET /api/evaluate/marks/<answer_sheet_id>` - Get all marks
- `GET /api/evaluate/marks/<answer_sheet_id>/total` - Get total marks
- `GET /api/evaluate/pdf-info/<answer_sheet_id>` - Get PDF info

## Project Structure

```
backend/
├── app.py                 # Main application
├── config.py              # Configuration
├── models.py              # Database models
├── requirements.txt       # Dependencies
├── routes/
│   ├── upload.py          # Upload routes
│   └── evaluation.py      # Evaluation routes
└── services/
    ├── gemini_ocr.py      # Gemini OCR service
    └── pdf_processor.py   # PDF utilities
```
