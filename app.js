// Password protection
const PASSWORD = 'growth2025';

const loginForm = document.getElementById('loginForm');
const loginScreen = document.getElementById('loginScreen');
const dashboard = document.getElementById('dashboard');
const errorMessage = document.getElementById('errorMessage');

// Check if already logged in
if (sessionStorage.getItem('authenticated') === 'true') {
    showDashboard();
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    
    if (password === PASSWORD) {
        sessionStorage.setItem('authenticated', 'true');
        showDashboard();
    } else {
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }
});

function showDashboard() {
    loginScreen.style.display = 'none';
    dashboard.classList.add('active');
    loadDashboard();
}

function logout() {
    sessionStorage.removeItem('authenticated');
    loginScreen.style.display = 'flex';
    dashboard.classList.remove('active');
    document.getElementById('password').value = '';
}

// Data structure
const weeklyData = {
    weeks: ['10/26', '10/19', '10/12', '10/5', '9/28', '9/21', '9/14', '9/7'],
    categories: {
        'Spend': {
            icon: '💰',
            total: [62535.95, 60351.30, 54755.04, 48835.36, 48916.39, 46074.52, 48106.80],
            channels: {
                'Google': [38050.58, 30480.45, 37260.32, 28920.18, 27478.99, 27690.84, 23452.15],
                'Microsoft': [17109.03, 19317.47, 5798.12, 5660.00, 6142.92, 2888.48, 6118.66],
                'Reddit': [3143.38, 5448.77, 5329.35, 4026.73, 3206.09, 3171.24, 3182.32],
                'Linkedin': [4232.96, 5104.61, 6367.25, 5561.59, 4073.01, 4328.68, 7338.80],
                'Stackadapt': [0.00, 0.00, 0.00, 4666.86, 8015.38, 7995.28, 8014.87]
            }
        },
        'Impressions': {
            icon: '👁️',
            total: [3090702, 5500001, 6425653, 7347913, 7093117, 5428627, 5303571],
            channels: {
                'Google': [1193280, 2085473, 1468017, 194077, 163784, 237071, 246201],
                'Microsoft': [135383, 335178, 397520, 3415494, 3435930, 1953569, 1696802],
                'Reddit': [383818, 716611, 758431, 562743, 439252, 445308, 1074105],
                'Linkedin': [1378221, 2362739, 3801685, 2594511, 1243091, 892620, 761867],
                'StackAdapt': [0, 0, 0, 581088, 1811060, 1900059, 1524596]
            }
        },
        'Clicks': {
            icon: '🖱️',
            total: [571320, 116157, 72165, 43537, 44229, 30110, 50513],
            channels: {
                'Google': [565557, 105074, 53635, 11871, 9656, 15751, 9656],
                'Microsoft': [2454, 4989, 13219, 28038, 30738, 11095, 31431],
                'Reddit': [1776, 3973, 2780, 1362, 1225, 1346, 2854],
                'Linkedin': [1533, 2121, 2531, 1973, 1609, 1110, 5857],
                'StackAdapt': [0, 0, 0, 293, 1001, 808, 715]
            }
        },
        'Conversions': {
            icon: '📈',
            total: [3540, 18733.85, 11337.46, 4227, 2923, 5700, 4500],
            channels: {
                'Google': [1374, 16097, 8693, 2387, 1692, 4191, 2606],
                'Microsoft': [292, 544, 0, 0, 0, 0, 0],
                'Reddit': [1183, 344, 442, 241, 219, 273, 291],
                'Linkedin': [691, 1749, 2202, 1586, 1001, 963, 1382],
                'StackAdapt': [0, 0, 0, 13, 11, 273, 221]
            }
        }
    }
};

function loadDashboard() {
    renderKPIs();
    renderCharts();
    renderAccordions();
}

function renderKPIs() {
    const kpiGrid = document.getElementById('kpiGrid');
    const currentWeek = 0; // Latest week
    const prevWeek = 1;
    
    const kpis = [
        {
            label: 'Total Spend',
            value: `$${formatNumber(weeklyData.categories['Spend'].total[currentWeek])}`,
            delta: calculateDelta(weeklyData.categories['Spend'].total[currentWeek], weeklyData.categories['Spend'].total[prevWeek])
        },
        {
            label: 'Total Impressions',
            value: formatNumber(weeklyData.categories['Impressions'].total[currentWeek]),
            delta: calculateDelta(weeklyData.categories['Impressions'].total[currentWeek], weeklyData.categories['Impressions'].total[prevWeek])
        },
        {
            label: 'Total Clicks',
            value: formatNumber(weeklyData.categories['Clicks'].total[currentWeek]),
            delta: calculateDelta(weeklyData.categories['Clicks'].total[currentWeek], weeklyData.categories['Clicks'].total[prevWeek])
        },
        {
            label: 'Total Conversions',
            value: formatNumber(weeklyData.categories['Conversions'].total[currentWeek]),
            delta: calculateDelta(weeklyData.categories['Conversions'].total[currentWeek], weeklyData.categories['Conversions'].total[prevWeek])
        }
    ];
    
    kpiGrid.innerHTML = kpis.map(kpi => `
        <div class="kpi-card">
            <div class="kpi-label">${kpi.label}</div>
            <div class="kpi-value">${kpi.value}</div>
            <div class="kpi-delta ${kpi.delta >= 0 ? 'positive' : 'negative'}">
                ${kpi.delta >= 0 ? '▲' : '▼'} ${Math.abs(kpi.delta).toFixed(1)}%
            </div>
        </div>
    `).join('');
}

function renderCharts() {
    renderSpendChart();
    renderChannelPieChart();
}

function renderSpendChart() {
    const ctx = document.getElementById('spendChart').getContext('2d');
    const data = weeklyData.categories['Spend'];
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: weeklyData.weeks,
            datasets: Object.keys(data.channels).map((channel, index) => ({
                label: channel,
                data: data.channels[channel],
                borderColor: getChannelColor(channel),
                backgroundColor: getChannelColor(channel, 0.1),
                tension: 0.3,
                fill: false
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#B8C0CC',
                        font: {
                            family: "'IBM Plex Mono', monospace",
                            size: 11
                        }
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        color: '#8B94A3',
                        font: {
                            family: "'IBM Plex Mono', monospace"
                        },
                        callback: function(value) {
                            return '$' + (value / 1000).toFixed(0) + 'K';
                        }
                    },
                    grid: {
                        color: 'rgba(255,255,255,0.04)'
                    }
                },
                x: {
                    ticks: {
                        color: '#8B94A3',
                        font: {
                            family: "'IBM Plex Mono', monospace"
                        }
                    },
                    grid: {
                        color: 'rgba(255,255,255,0.02)'
                    }
                }
            }
        }
    });
}

function renderChannelPieChart() {
    const ctx = document.getElementById('channelPieChart').getContext('2d');
    const currentWeek = 0;
    const channels = weeklyData.categories['Spend'].channels;
    
    const labels = Object.keys(channels);
    const data = labels.map(channel => channels[channel][currentWeek]);
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: labels.map(channel => getChannelColor(channel, 0.8)),
                borderColor: labels.map(channel => getChannelColor(channel)),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#B8C0CC',
                        font: {
                            family: "'IBM Plex Mono', monospace",
                            size: 11
                        },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            return data.labels.map((label, i) => ({
                                text: `${label}: $${formatNumber(data.datasets[0].data[i])}`,
                                fillStyle: data.datasets[0].backgroundColor[i],
                                hidden: false,
                                index: i
                            }));
                        }
                    }
                }
            }
        }
    });
}

function renderAccordions() {
    const container = document.getElementById('accordionContainer');
    const categories = weeklyData.categories;
    
    container.innerHTML = Object.keys(categories).map((category, index) => {
        const data = categories[category];
        const currentValue = data.total[0];
        const summary = category === 'Spend' ? `$${formatNumber(currentValue)}` : formatNumber(currentValue);
        
        return `
            <div class="accordion-item ${index === 0 ? 'active' : ''}" id="accordion-${index}">
                <div class="accordion-header" onclick="toggleAccordion(${index})">
                    <div class="accordion-title">
                        <span>${data.icon}</span>
                        <h3>${category}</h3>
                    </div>
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <span class="accordion-summary">${summary}</span>
                        <span class="accordion-icon">▼</span>
                    </div>
                </div>
                <div class="accordion-content">
                    <table class="accordion-table">
                        <thead>
                            <tr>
                                <th>Channel</th>
                                ${weeklyData.weeks.map(week => `<th class="numeric">${week}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.keys(data.channels).map(channel => `
                                <tr>
                                    <td class="platform-${channel.toLowerCase()}">${channel}</td>
                                    ${data.channels[channel].map((value, i) => `
                                        <td class="numeric">${category === 'Spend' ? '$' + formatNumber(value) : formatNumber(value)}</td>
                                    `).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }).join('');
}

function toggleAccordion(index) {
    const item = document.getElementById(`accordion-${index}`);
    item.classList.toggle('active');
}

function getChannelColor(channel, alpha = 1) {
    const colors = {
        'Google': `rgba(77, 214, 255, ${alpha})`,
        'Microsoft': `rgba(156, 255, 90, ${alpha})`,
        'Reddit': `rgba(240, 179, 76, ${alpha})`,
        'Linkedin': `rgba(41, 127, 135, ${alpha})`,
        'Stackadapt': `rgba(231, 242, 75, ${alpha})`,
        'StackAdapt': `rgba(231, 242, 75, ${alpha})`
    };
    return colors[channel] || `rgba(184, 192, 204, ${alpha})`;
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(0);
}

function calculateDelta(current, previous) {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
}
