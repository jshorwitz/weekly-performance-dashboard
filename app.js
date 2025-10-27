// Password protection
const PASSWORD = 'growth2025'; // Change this to your desired password

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
    loadData();
}

function logout() {
    sessionStorage.removeItem('authenticated');
    loginScreen.style.display = 'flex';
    dashboard.classList.remove('active');
    document.getElementById('password').value = '';
}

// CSV Data
const csvData = `Metric,Week Ending 10/26/2025,Week Ending 10/19/2025,Week Ending 10/12/2025,Week Ending 10/5/2025,Week Ending 9/28/2025,Week Ending 9/21/2025,Week Ending 9/14/2025,Week Ending 9/7/2025,Notes
Spend,,"$62,535.95","$60,351.30","$54,755.04","$48,835.36","$48,916.39","$46,074.52","$48,106.80",
Stackadapt,,$0.00,$0.00,$0.00,"$4,666.86","$8,015.38","$7,995.28","$8,014.87",
Google,,"$38,050.58","$30,480.45","$37,260.32","$28,920.18","$27,478.99","$27,690.84","$23,452.15",
Linkedin,,"$4,232.96","$5,104.61","$6,367.25","$5,561.59","$4,073.01","$4,328.68","$7,338.80",
Reddit,,"$3,143.38","$5,448.77","$5,329.35","$4,026.73","$3,206.09","$3,171.24","$3,182.32",
Microsoft,,"$17,109.03","$19,317.47","$5,798.12","$5,660.00","$6,142.92","$2,888.48","$6,118.66",
Impressions,,"3,090,702","5,500,001","6,425,653","7,347,913","7,093,117","5,428,627","5,303,571",
StackAdapt,,0,0,0,"581,088","1,811,060","1,900,059","1,524,596",
Google,,"1,193,280","2,085,473","1,468,017","194,077","163,784","237,071","246,201",
Linkedin,,"1,378,221","2,362,739","3,801,685","2,594,511","1,243,091","892,620","761,867",
Reddit,,"383,818","716,611","758,431","562,743","439,252","445,308","1,074,105",
Microsoft,,"135,383","335,178","397,520","3,415,494","3,435,930","1,953,569","1,696,802",
Clicks,,"571,320","116,157","72,165","43,537","44,229","30,110","50,513",
StackAdapt,,0,0,0,293,"1,001",808,715,
Google,,"565,557","105,074","53,635","11,871","9,656","15,751","9,656",
Linkedin,,"1,533","2,121","2,531","1,973","1,609","1,110","5,857",
Reddit,,"1,776","3,973","2,780","1,362","1,225","1,346","2,854",
Microsoft,,"2,454","4,989","13,219","28,038","30,738","11,095","31,431",
Click-Through Rate (CTR),,1.72%,1.20%,1.62%,1.46%,1.45%,1.76%,1.37%,
StackAdapt,,-,0.00%,0.00%,0.05%,0.06%,0.04%,0.05%,
Google,,4.48%,3.89%,4.33%,6.12%,5.90%,6.64%,3.92%,
Linkedin,,0.11%,0.09%,0.07%,0.08%,0.13%,0.35%,0.77%,
Reddit,,0.46%,0.55%,0.37%,0.24%,0.28%,0.30%,0.27%,
Microsoft,,1.81%,1.49%,3.33%,0.82%,0.89%,1.47%,1.85%,
Conversions (page views),,3540,18733.85,11337.46,4227,2923,5700,4500,
StackAdapt,,0,0,0,13,11,273,221,
Google,,"1,374","16,097","8,693","2,387","1,692","4,191","2,606",
Linkedin,,691,"1,749","2,202","1,586","1,001",963,"1,382",
Reddit,,1183,344,442,241,219,273,291,
Microsoft,,292,544,,,,,,
"Cost Per Interaction (clicks, engagements)",,$5.41,$47.35,$89.04,$168.77,$160.37,$180.29,$104.99,
Cost Per Conversion,,$17.67,$3.22,$4.83,$11.55,$16.73,$8.08,$10.69,
AIQLs,,,364.00,44.00,51.00,20.00,27.00,15.00,
Cost Per AIQL,,,$165.80,"$1,244.43",$957.56,"$2,445.82","$1,706.46","$3,207.12",`;

function loadData() {
    const tbody = document.getElementById('tableBody');
    const rows = csvData.split('\n').slice(1); // Skip header row

    const sectionHeaders = ['Spend', 'Impressions', 'Clicks', 'Click-Through Rate (CTR)', 'Conversions (page views)'];
    const platforms = {
        'Stackadapt': 'platform-stackadapt',
        'StackAdapt': 'platform-stackadapt',
        'Google': 'platform-google',
        'Linkedin': 'platform-linkedin',
        'Reddit': 'platform-reddit',
        'Microsoft': 'platform-microsoft'
    };

    rows.forEach(row => {
        const cols = parseCSVRow(row);
        if (cols.length > 0 && cols[0]) {
            const tr = document.createElement('tr');
            
            // Check if this is a section header
            const isSection = sectionHeaders.some(h => cols[0].includes(h));
            const isPlatform = platforms[cols[0]] !== undefined;
            
            if (isSection) {
                tr.classList.add('section-header');
            }

            cols.forEach((col, index) => {
                const td = document.createElement('td');
                
                if (index === 0) {
                    // Metric name column
                    if (isPlatform) {
                        td.className = `platform-indent ${platforms[col]}`;
                    } else {
                        td.className = isSection ? 'metric-name' : 'metric-name';
                    }
                    td.textContent = col;
                } else if (index === cols.length - 1) {
                    // Notes column
                    td.className = 'neutral';
                    td.textContent = col || '—';
                } else {
                    // Data columns
                    td.className = 'numeric';
                    td.textContent = col || '—';
                }
                
                tr.appendChild(td);
            });
            
            tbody.appendChild(tr);
        }
    });
}

function parseCSVRow(row) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current);
    return result;
}
