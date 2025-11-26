# Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.9 or higher)
- Git
- Code editor (VS Code recommended)

## Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/SMara99/Bachelor.git
cd Bachelor
```

### 2. Backend Setup (Node.js)

```bash
cd backend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
- OpenAI API key
- Database credentials (if using PostgreSQL)
- Other API keys as needed

Start the backend server:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

### 3. ML Service Setup (Python)

```bash
cd ml-service
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

Start the ML service:
```bash
python app.py
```

The ML service will run on `http://localhost:5000`

### 4. Frontend Setup

The frontend is a static site - no build process required.

Option 1: Use Live Server (VS Code extension)
- Install "Live Server" extension
- Right-click `frontend/index.html`
- Select "Open with Live Server"

Option 2: Use Python HTTP server
```bash
cd frontend
python -m http.server 8000
```

Visit `http://localhost:8000`

## Configuration

### API Keys

You'll need the following API keys:

1. **OpenAI API** (Required for AI features)
   - Sign up at https://platform.openai.com
   - Create API key
   - Add to backend `.env`: `OPENAI_API_KEY=your_key`

2. **Alpha Vantage** (Optional - for stock data)
   - Free tier available at https://www.alphavantage.co
   - Add to backend `.env`: `ALPHA_VANTAGE_API_KEY=your_key`

### Database (Optional)

For production, set up PostgreSQL:

```sql
CREATE DATABASE bi_dashboard;
```

Update `.env` with database credentials.

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### ML Service Tests
```bash
cd ml-service
pytest
```

## Troubleshooting

### Port Already in Use

If you get "Port already in use" error:

Windows:
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Python Package Installation Issues

Try upgrading pip:
```bash
python -m pip install --upgrade pip
```

### CORS Issues

Make sure `CORS_ORIGIN` in backend `.env` matches your frontend URL.

## Next Steps

1. Add real data sources
2. Integrate OpenAI API for natural language queries
3. Deploy to production (see DEPLOYMENT.md)
4. Set up authentication
5. Add more ML models

## Development Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes
3. Test locally
4. Commit: `git commit -m "Add feature"`
5. Push: `git push origin feature/your-feature`
6. Create pull request

## Support

For issues or questions, create an issue on GitHub.
