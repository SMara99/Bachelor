const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Dashboard data endpoint
app.get('/api/dashboard', async (req, res) => {
    try {
        // TODO: Fetch data from database
        const data = {
            revenue: generateMockRevenue(),
            customers: 1247,
            conversionRate: 24.5,
            transactions: generateMockTransactions()
        };
        res.json(data);
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

// AI Query endpoint
app.post('/api/ai/query', async (req, res) => {
    try {
        const { query, context } = req.body;
        
        // TODO: Integrate with OpenAI API
        // const aiResponse = await callOpenAI(query, context);
        
        // Mock response for now
        const response = {
            answer: 'This is a mock AI response. Integration with OpenAI API coming soon.',
            confidence: 0.85,
            suggestions: ['Review conversion funnel', 'Analyze customer segments']
        };
        
        res.json(response);
    } catch (error) {
        console.error('AI query error:', error);
        res.status(500).json({ error: 'Failed to process AI query' });
    }
});

// Predictions endpoint
app.get('/api/predictions', async (req, res) => {
    try {
        // TODO: Call ML service for predictions
        const predictions = {
            nextMonth: {
                revenue: 127500,
                confidence: 0.87
            },
            trends: ['upward', 'seasonal_peak']
        };
        
        res.json(predictions);
    } catch (error) {
        console.error('Predictions error:', error);
        res.status(500).json({ error: 'Failed to generate predictions' });
    }
});

// Helper functions
function generateMockRevenue() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, i) => ({
        month,
        amount: 50000 + Math.random() * 50000 + i * 10000
    }));
}

function generateMockTransactions() {
    const transactions = [];
    const customers = ['Acme Corp', 'TechStart Inc', 'Global Solutions'];
    const products = ['Enterprise Plan', 'Premium License', 'Consulting Services'];
    
    for (let i = 0; i < 15; i++) {
        transactions.push({
            id: i + 1,
            date: new Date(2025, 10, Math.floor(Math.random() * 26) + 1).toISOString(),
            customer: customers[Math.floor(Math.random() * customers.length)],
            product: products[Math.floor(Math.random() * products.length)],
            amount: (Math.random() * 10000 + 1000).toFixed(2),
            status: ['Completed', 'Pending', 'Processing'][Math.floor(Math.random() * 3)]
        });
    }
    
    return transactions;
}

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Dashboard API ready`);
});

module.exports = app;
