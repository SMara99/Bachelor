from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Global models (in production, load from saved models)
revenue_model = None
scaler = StandardScaler()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'OK', 'message': 'ML Service is running'})

@app.route('/predict/revenue', methods=['POST'])
def predict_revenue():
    """
    Predict future revenue based on historical data
    Expected input: { "historical_data": [...] }
    """
    try:
        data = request.json
        historical_data = data.get('historical_data', [])
        
        if len(historical_data) < 3:
            return jsonify({'error': 'Insufficient historical data'}), 400
        
        # Prepare data
        X = np.array(range(len(historical_data))).reshape(-1, 1)
        y = np.array(historical_data)
        
        # Train simple linear regression model
        model = LinearRegression()
        model.fit(X, y)
        
        # Predict next month
        next_month = len(historical_data)
        prediction = model.predict([[next_month]])[0]
        
        # Calculate confidence based on R² score
        confidence = model.score(X, y)
        
        return jsonify({
            'prediction': float(prediction),
            'confidence': float(confidence),
            'trend': 'upward' if model.coef_[0] > 0 else 'downward',
            'model': 'linear_regression'
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/analyze/trends', methods=['POST'])
def analyze_trends():
    """
    Analyze trends in business data
    Expected input: { "data": [...], "metric": "revenue|customers|conversion" }
    """
    try:
        data = request.json
        time_series = data.get('data', [])
        metric = data.get('metric', 'revenue')
        
        if len(time_series) < 2:
            return jsonify({'error': 'Insufficient data for trend analysis'}), 400
        
        # Calculate basic statistics
        values = np.array(time_series)
        mean = np.mean(values)
        std = np.std(values)
        trend = (values[-1] - values[0]) / values[0] * 100
        
        # Detect anomalies (values > 2 std deviations)
        anomalies = []
        for i, val in enumerate(values):
            if abs(val - mean) > 2 * std:
                anomalies.append({'index': i, 'value': float(val)})
        
        return jsonify({
            'metric': metric,
            'mean': float(mean),
            'std': float(std),
            'trend_percentage': float(trend),
            'direction': 'increasing' if trend > 0 else 'decreasing',
            'volatility': 'high' if std / mean > 0.3 else 'low',
            'anomalies': anomalies
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/insights/generate', methods=['POST'])
def generate_insights():
    """
    Generate AI insights from business data
    Expected input: { "metrics": {...} }
    """
    try:
        data = request.json
        metrics = data.get('metrics', {})
        
        insights = []
        
        # Revenue insight
        if 'revenue' in metrics:
            revenue_change = metrics['revenue'].get('change', 0)
            if revenue_change > 10:
                insights.append({
                    'type': 'positive',
                    'title': 'Strong Revenue Growth',
                    'description': f'Revenue increased by {revenue_change:.1f}%, exceeding expectations.',
                    'priority': 'high'
                })
            elif revenue_change < -5:
                insights.append({
                    'type': 'warning',
                    'title': 'Revenue Decline',
                    'description': f'Revenue decreased by {abs(revenue_change):.1f}%. Investigate causes.',
                    'priority': 'high'
                })
        
        # Conversion rate insight
        if 'conversion_rate' in metrics:
            conv_rate = metrics['conversion_rate'].get('value', 0)
            if conv_rate < 20:
                insights.append({
                    'type': 'opportunity',
                    'title': 'Conversion Rate Optimization',
                    'description': 'Conversion rate is below industry average. Consider A/B testing.',
                    'priority': 'medium'
                })
        
        # Customer insight
        if 'customers' in metrics:
            customer_change = metrics['customers'].get('change', 0)
            if customer_change > 15:
                insights.append({
                    'type': 'positive',
                    'title': 'Rapid Customer Growth',
                    'description': f'Customer base grew by {customer_change:.1f}%. Maintain momentum.',
                    'priority': 'high'
                })
        
        return jsonify({
            'insights': insights,
            'generated_at': pd.Timestamp.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/anomaly/detect', methods=['POST'])
def detect_anomalies():
    """
    Detect anomalies in time series data
    Expected input: { "data": [...] }
    """
    try:
        data = request.json
        time_series = np.array(data.get('data', []))
        
        if len(time_series) < 5:
            return jsonify({'error': 'Insufficient data for anomaly detection'}), 400
        
        # Simple anomaly detection using z-score
        mean = np.mean(time_series)
        std = np.std(time_series)
        
        anomalies = []
        for i, value in enumerate(time_series):
            z_score = (value - mean) / std if std > 0 else 0
            if abs(z_score) > 2:
                anomalies.append({
                    'index': i,
                    'value': float(value),
                    'z_score': float(z_score),
                    'severity': 'high' if abs(z_score) > 3 else 'medium'
                })
        
        return jsonify({
            'anomalies_detected': len(anomalies),
            'anomalies': anomalies,
            'threshold': 2.0,
            'mean': float(mean),
            'std': float(std)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('ML_SERVICE_PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
