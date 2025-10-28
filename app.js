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
    weeks: ['9/7', '9/14', '9/21', '9/28', '10/5', '10/12', '10/19', '10/26'],
    categories: {
        'Spend': {
            icon: '💰',
            total: [48106.8, 46074.52, 48916.39, 48835.36, 54755.04, 60351.3, 62535.95, 34047.92],
            channels: {
                'Google': [23452.15, 27690.84, 27478.99, 28920.18, 37260.32, 30480.45, 38050.58, 26046.34],
                'Microsoft': [6118.66, 2888.48, 6142.92, 5660.0, 5798.12, 19317.47, 17109.03, 0.0],
                'Reddit': [3182.32, 3171.24, 3206.09, 4026.73, 5329.35, 5448.77, 3143.38, 3768.62],
                'Linkedin': [7338.80, 4328.68, 4073.01, 5561.59, 6367.25, 5104.61, 4232.96, 4232.96],
                'Stackadapt': [8014.87, 7995.28, 8015.38, 4666.86, 0.00, 0.00, 0.00, 0.00]
            }
        },
        'Impressions': {
            icon: '👁️',
            total: [5303571, 5428627, 7093117, 7347913, 6425653, 5500001, 3090702, 2982067],
            channels: {
                'Google': [246201, 237071, 163784, 194077, 1468017, 2085473, 1193280, 1193280],
                'Microsoft': [1696802, 1953569, 3435930, 3415494, 397520, 335178, 135383, 135383],
                'Reddit': [1074105, 445308, 439252, 562743, 758431, 716611, 383818, 727063],
                'Linkedin': [761867, 892620, 1243091, 2594511, 3801685, 2362739, 1378221, 1378221],
                'StackAdapt': [1524596, 1900059, 1811060, 581088, 0, 0, 0, 0]
            }
        },
        'Clicks': {
            icon: '🖱️',
            total: [50513, 30110, 44229, 43537, 72165, 116157, 571320, 18714],
            channels: {
                'Google': [9656, 15751, 9656, 11871, 53635, 105074, 565557, 565557],
                'Microsoft': [31431, 11095, 30738, 28038, 13219, 4989, 2454, 2454],
                'Reddit': [2854, 1346, 1225, 1362, 2780, 3973, 1776, 2148],
                'Linkedin': [5857, 1110, 1609, 1973, 2531, 2121, 1533, 1533],
                'StackAdapt': [715, 808, 1001, 293, 0, 0, 0, 0]
            }
        },
        'Conversions': {
            icon: '📈',
            total: [4500.0, 5700.0, 2923.0, 4227.0, 11337.46, 18733.85, 3540.0, 2431.2],
            channels: {
                'Google': [2606, 4191, 1692, 2387, 8693, 16097, 1374, 1374],
                'Microsoft': [0, 0, 0, 0, 0, 544, 292, 292],
                'Reddit': [291.0, 273.0, 219.0, 241.0, 442.0, 344.0, 1183.0, 7],
                'Linkedin': [1382, 963, 1001, 1586, 2202, 1749, 691, 691],
                'StackAdapt': [221, 273, 11, 13, 0, 0, 0, 0]
            }
        },
        'AIQLs': {
            icon: '🎯',
            total: [null, null, null, null, 1, 56, 46, 43]
        },
        'Hand Raisers': {
            icon: '✋',
            total: [3, 5, 5, 7, 12, 16, 6, 5]
        }
    }
};

function loadDashboard() {
    console.log('Loading dashboard...');
    console.log('Week data:', weeklyData);
    try {
        renderKPIs();
        console.log('KPIs rendered');
    } catch (e) {
        console.error('Error rendering KPIs:', e);
    }
    try {
        renderCharts();
        console.log('Charts rendered');
    } catch (e) {
        console.error('Error rendering charts:', e);
    }
    try {
        renderAccordions();
        console.log('Accordions rendered');
    } catch (e) {
        console.error('Error rendering accordions:', e);
    }
    try {
        renderAIQLBreakdown();
        console.log('AIQL breakdown rendered');
    } catch (e) {
        console.error('Error rendering AIQL breakdown:', e);
    }
    console.log('Dashboard loaded successfully');
}

function renderKPIs() {
    const kpiGrid = document.getElementById('kpiGrid');
    const currentWeek = weeklyData.weeks.length - 1; // Latest week (now last in array)
    const prevWeek = currentWeek - 1;
    
    console.log('KPI Debug:', {
        currentWeek,
        prevWeek,
        currentSpend: weeklyData.categories['Spend'].total[currentWeek],
        prevSpend: weeklyData.categories['Spend'].total[prevWeek]
    });
    
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
    
    console.log('KPIs with deltas:', kpis);
    
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
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded - skipping chart renders');
        return;
    }
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
    const currentWeek = weeklyData.weeks.length - 1; // Latest week (now last in array)
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
                                strokeStyle: data.datasets[0].borderColor[i],
                                fontColor: '#B8C0CC',
                                color: '#B8C0CC',
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
        const currentValue = data.total[data.total.length - 1]; // Latest week (now last in array)
        const summary = category === 'Spend' ? `$${formatNumber(currentValue)}` : formatNumber(currentValue);
        
        // Categories with channel breakdown
        const hasChannels = data.channels !== undefined;
        
        // Calculate Cost Per for AIQLs and Hand Raisers
        let costPerMetric = '';
        if (category === 'AIQLs' || category === 'Hand Raisers') {
            const spend = weeklyData.categories['Spend'].total;
            const costPer = data.total.map((val, i) => val > 0 ? (spend[i] / val) : 0);
            data.costPer = costPer;
            costPerMetric = `$${formatNumber(costPer[costPer.length - 1])} CPL`; // Latest week
        }
        
        return `
            <div class="accordion-item ${index === 0 ? 'active' : ''}" id="accordion-${index}">
                <div class="accordion-header" onclick="toggleAccordion(${index})">
                    <div class="accordion-title">
                        <span>${data.icon}</span>
                        <h3>${category}</h3>
                    </div>
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <span class="accordion-summary">${summary}</span>
                        ${costPerMetric ? `<span class="accordion-summary" style="color: var(--accent-amber);">${costPerMetric}</span>` : ''}
                        <span class="accordion-icon">▼</span>
                    </div>
                </div>
                ${hasChannels ? `
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
                ` : `
                <div class="accordion-content">
                    <table class="accordion-table">
                        <thead>
                            <tr>
                                <th>Metric</th>
                                ${weeklyData.weeks.map(week => `<th class="numeric">${week}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${category}</td>
                                ${data.total.map(value => `
                                    <td class="numeric">${value !== null ? formatNumber(value) : '—'}</td>
                                `).join('')}
                            </tr>
                            ${data.costPer ? `
                            <tr>
                                <td style="color: var(--accent-amber);">Cost Per ${category === 'AIQLs' ? 'AIQL' : 'Hand Raiser'}</td>
                                ${data.costPer.map(value => `
                                    <td class="numeric" style="color: var(--accent-amber);">${value > 0 ? '$' + formatNumber(value) : '—'}</td>
                                `).join('')}
                            </tr>
                            ` : ''}
                        </tbody>
                    </table>
                </div>
                `}
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
    if (num == null || !isFinite(num)) return '—';
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

function renderAIQLBreakdown() {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded - skipping AIQL breakdown charts');
        return;
    }
    
    // Email Type Chart
    const emailCtx = document.getElementById('emailTypeChart').getContext('2d');
    new Chart(emailCtx, {
        type: 'doughnut',
        data: {
            labels: ['Free Emails', 'Attached to Accounts'],
            datasets: [{
                data: [96, 4],
                backgroundColor: [
                    'rgba(77, 214, 255, 0.8)',
                    'rgba(62, 224, 143, 0.8)'
                ],
                borderColor: [
                    'rgba(77, 214, 255, 1)',
                    'rgba(62, 224, 143, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#B8C0CC',
                        font: {
                            family: "'IBM Plex Mono', monospace",
                            size: 11
                        },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            return data.labels.map((label, i) => ({
                                text: `${label}: ${data.datasets[0].data[i]}%`,
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

    // Segmentation Chart
    const segCtx = document.getElementById('segmentationChart').getContext('2d');
    new Chart(segCtx, {
        type: 'bar',
        data: {
            labels: ['Strategic', 'Not Known', 'Enterprise', 'SMB', 'Self-Service'],
            datasets: [{
                label: 'Accounts',
                data: [14, 53, 2, 2, 1],
                backgroundColor: [
                    'rgba(228, 69, 58, 0.8)',
                    'rgba(139, 148, 163, 0.8)',
                    'rgba(156, 255, 90, 0.8)',
                    'rgba(77, 214, 255, 0.8)',
                    'rgba(240, 179, 76, 0.8)'
                ],
                borderColor: [
                    'rgba(228, 69, 58, 1)',
                    'rgba(139, 148, 163, 1)',
                    'rgba(156, 255, 90, 1)',
                    'rgba(77, 214, 255, 1)',
                    'rgba(240, 179, 76, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#8B94A3',
                        font: {
                            family: "'IBM Plex Mono', monospace"
                        },
                        stepSize: 10
                    },
                    grid: {
                        color: 'rgba(255,255,255,0.04)'
                    }
                },
                x: {
                    ticks: {
                        color: '#8B94A3',
                        font: {
                            family: "'IBM Plex Mono', monospace",
                            size: 10
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}
