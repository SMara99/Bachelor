# API Documentation

## Backend API (Node.js/Express)

Base URL: `http://localhost:3000/api`

### Endpoints

#### 1. Health Check
```
GET /health
```
Returns server status.

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

#### 2. Dashboard Data
```
GET /dashboard
```
Returns comprehensive dashboard data including revenue, customers, and transactions.

**Response:**
```json
{
  "revenue": [...],
  "customers": 1247,
  "conversionRate": 24.5,
  "transactions": [...]
}
```

#### 3. AI Query
```
POST /ai/query
```
Send natural language queries about business data.

**Request Body:**
```json
{
  "query": "What's the revenue trend?",
  "context": { ...dashboardData }
}
```

**Response:**
```json
{
  "answer": "Revenue has increased...",
  "confidence": 0.85,
  "suggestions": [...]
}
```

#### 4. Predictions
```
GET /predictions
```
Get AI-generated predictions for future metrics.

**Response:**
```json
{
  "nextMonth": {
    "revenue": 127500,
    "confidence": 0.87
  },
  "trends": ["upward", "seasonal_peak"]
}
```

---

## ML Service API (Python/Flask)

Base URL: `http://localhost:5000`

### Endpoints

#### 1. Revenue Prediction
```
POST /predict/revenue
```
Predict future revenue based on historical data.

**Request Body:**
```json
{
  "historical_data": [50000, 65000, 78000, 92000, 105000]
}
```

**Response:**
```json
{
  "prediction": 118500.0,
  "confidence": 0.92,
  "trend": "upward",
  "model": "linear_regression"
}
```

#### 2. Trend Analysis
```
POST /analyze/trends
```
Analyze trends in business metrics.

**Request Body:**
```json
{
  "data": [100, 110, 105, 120, 130],
  "metric": "revenue"
}
```

**Response:**
```json
{
  "metric": "revenue",
  "mean": 113.0,
  "std": 11.4,
  "trend_percentage": 30.0,
  "direction": "increasing",
  "volatility": "low",
  "anomalies": []
}
```

#### 3. Generate Insights
```
POST /insights/generate
```
Generate AI-powered business insights.

**Request Body:**
```json
{
  "metrics": {
    "revenue": { "value": 120000, "change": 12.5 },
    "conversion_rate": { "value": 24.5 },
    "customers": { "value": 1247, "change": 8.3 }
  }
}
```

**Response:**
```json
{
  "insights": [
    {
      "type": "positive",
      "title": "Strong Revenue Growth",
      "description": "Revenue increased by 12.5%",
      "priority": "high"
    }
  ],
  "generated_at": "2025-11-26T..."
}
```

#### 4. Anomaly Detection
```
POST /anomaly/detect
```
Detect anomalies in time series data.

**Request Body:**
```json
{
  "data": [100, 105, 102, 250, 108, 110]
}
```

**Response:**
```json
{
  "anomalies_detected": 1,
  "anomalies": [
    {
      "index": 3,
      "value": 250.0,
      "z_score": 3.2,
      "severity": "high"
    }
  ],
  "threshold": 2.0,
  "mean": 129.17,
  "std": 57.8
}
```

---

## Error Responses

All endpoints return standard error responses:

```json
{
  "error": "Error description"
}
```

HTTP Status Codes:
- `200`: Success
- `400`: Bad Request
- `500`: Internal Server Error
