// Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// State management
let dashboardData = {
    revenue: [],
    customers: [],
    transactions: [],
    predictions: {}
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Dashboard initializing...');
    
    // Set up event listeners
    setupEventListeners();
    
    // Load initial data
    await loadDashboardData();
    
    // Initialize charts
    initializeCharts();
    
    // Load AI insights
    await loadAIInsights();
});

// Event Listeners
function setupEventListeners() {
    // AI Query
    document.getElementById('askAI').addEventListener('click', handleAIQuery);
    document.getElementById('aiQuery').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAIQuery();
    });
    
    // Modal close
    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('aiModal').classList.add('hidden');
    });
    
    // Export data
    document.getElementById('exportData').addEventListener('click', exportToCSV);
    
    // Table search
    document.getElementById('searchTable').addEventListener('input', filterTable);
}

// Load Dashboard Data
async function loadDashboardData() {
    try {
        // For now, use mock data
        // In production, fetch from API: const response = await fetch(`${API_BASE_URL}/dashboard`);
        
        dashboardData = generateMockData();
        updateKPIs();
        updateTable();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showError('Failed to load dashboard data');
    }
}

// Generate Mock Data
function generateMockData() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const revenue = months.map((month, i) => ({
        month,
        amount: 50000 + Math.random() * 50000 + i * 10000
    }));
    
    const transactions = [];
    const customers = ['Acme Corp', 'TechStart Inc', 'Global Solutions', 'Innovate Ltd', 'Digital Wave'];
    const products = ['Enterprise Plan', 'Premium License', 'Consulting Services', 'Support Package'];
    const statuses = ['Completed', 'Pending', 'Processing'];
    
    for (let i = 0; i < 15; i++) {
        transactions.push({
            date: new Date(2025, 10, Math.floor(Math.random() * 26) + 1).toLocaleDateString(),
            customer: customers[Math.floor(Math.random() * customers.length)],
            product: products[Math.floor(Math.random() * products.length)],
            amount: (Math.random() * 10000 + 1000).toFixed(2),
            status: statuses[Math.floor(Math.random() * statuses.length)]
        });
    }
    
    return {
        revenue,
        transactions,
        totalRevenue: revenue.reduce((sum, r) => sum + r.amount, 0),
        activeCustomers: 1247,
        conversionRate: 24.5,
        forecast: 127500,
        forecastConfidence: 87
    };
}

// Update KPIs
function updateKPIs() {
    const { totalRevenue, activeCustomers, conversionRate, forecast, forecastConfidence } = dashboardData;
    
    document.getElementById('totalRevenue').textContent = `$${(totalRevenue / 1000).toFixed(0)}K`;
    document.getElementById('revenueChange').textContent = '+12.5%';
    
    document.getElementById('activeCustomers').textContent = activeCustomers.toLocaleString();
    document.getElementById('customerChange').textContent = '+8.3%';
    
    document.getElementById('conversionRate').textContent = `${conversionRate}%`;
    document.getElementById('conversionChange').textContent = '-2.1%';
    
    document.getElementById('aiForecast').textContent = `$${(forecast / 1000).toFixed(0)}K`;
    document.getElementById('forecastConfidence').textContent = `Confidence: ${forecastConfidence}%`;
}

// Initialize Charts
function initializeCharts() {
    initRevenueChart();
    initCategoryChart();
}

function initRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    const { revenue } = dashboardData;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: revenue.map(r => r.month),
            datasets: [{
                label: 'Revenue ($)',
                data: revenue.map(r => r.amount),
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: '#f1f5f9' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#94a3b8' },
                    grid: { color: '#475569' }
                },
                x: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: '#475569' }
                }
            }
        }
    });
}

function initCategoryChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Enterprise', 'Premium', 'Consulting', 'Support'],
            datasets: [{
                data: [35, 28, 22, 15],
                backgroundColor: [
                    '#6366f1',
                    '#8b5cf6',
                    '#10b981',
                    '#f59e0b'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { color: '#f1f5f9' }
                }
            }
        }
    });
}

// Update Table
function updateTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    dashboardData.transactions.forEach(transaction => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${transaction.date}</td>
            <td>${transaction.customer}</td>
            <td>${transaction.product}</td>
            <td>$${transaction.amount}</td>
            <td><span class="status-badge status-${transaction.status.toLowerCase()}">${transaction.status}</span></td>
        `;
    });
}

// Filter Table
function filterTable(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#tableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Handle AI Query
async function handleAIQuery() {
    const query = document.getElementById('aiQuery').value.trim();
    if (!query) return;
    
    const modal = document.getElementById('aiModal');
    const responseDiv = document.getElementById('aiResponse');
    
    responseDiv.innerHTML = '<div class="loading">🤖 Analyzing your question...</div>';
    modal.classList.remove('hidden');
    
    try {
        // TODO: Replace with actual API call to backend
        // const response = await fetch(`${API_BASE_URL}/ai/query`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ query, context: dashboardData })
        // });
        // const data = await response.json();
        
        // Mock response for now
        await new Promise(resolve => setTimeout(resolve, 1500));
        const mockResponse = generateMockAIResponse(query);
        
        responseDiv.innerHTML = `<p>${mockResponse}</p>`;
    } catch (error) {
        console.error('AI query error:', error);
        responseDiv.innerHTML = '<p class="error">Failed to get AI response. Please try again.</p>';
    }
}

// Generate Mock AI Response
function generateMockAIResponse(query) {
    const responses = {
        revenue: 'Based on current trends, revenue has increased by 12.5% compared to last month. The growth is primarily driven by Enterprise plan subscriptions, which account for 35% of total revenue.',
        forecast: 'AI forecast predicts revenue of $127.5K for next month with 87% confidence. This projection is based on historical patterns, seasonal trends, and current conversion rates.',
        customers: 'You currently have 1,247 active customers, showing an 8.3% increase from last month. Customer retention rate is strong at 94%, indicating high satisfaction.',
        default: 'I\'ve analyzed your business data. Revenue trends are positive with steady month-over-month growth. Focus areas: Improve conversion rate (currently 24.5%) and expand Premium tier adoption.'
    };
    
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('revenue') || lowerQuery.includes('sales')) return responses.revenue;
    if (lowerQuery.includes('forecast') || lowerQuery.includes('predict')) return responses.forecast;
    if (lowerQuery.includes('customer')) return responses.customers;
    return responses.default;
}

// Load AI Insights
async function loadAIInsights() {
    const container = document.getElementById('aiInsights');
    
    // Mock insights
    const insights = [
        {
            type: 'trend',
            title: 'Revenue Growth Accelerating',
            description: 'Revenue has increased 12.5% this month, outpacing the 6-month average of 8.2%.',
            severity: 'positive'
        },
        {
            type: 'alert',
            title: 'Conversion Rate Decline',
            description: 'Conversion rate dropped 2.1%. Consider reviewing the checkout process.',
            severity: 'warning'
        },
        {
            type: 'opportunity',
            title: 'Enterprise Segment Growth',
            description: 'Enterprise customers show 35% higher lifetime value. Focus marketing efforts here.',
            severity: 'info'
        }
    ];
    
    container.innerHTML = insights.map(insight => `
        <div class="insight-card ${insight.severity}">
            <strong>${insight.title}</strong>
            <p>${insight.description}</p>
        </div>
    `).join('');
}

// Export to CSV
function exportToCSV() {
    const { transactions } = dashboardData;
    
    const headers = ['Date', 'Customer', 'Product', 'Amount', 'Status'];
    const rows = transactions.map(t => [t.date, t.customer, t.product, t.amount, t.status]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Error Display
function showError(message) {
    console.error(message);
    // Could implement toast notifications here
}
