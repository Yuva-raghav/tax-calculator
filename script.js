// --- Element Selectors ---
const showTaxBtn = document.getElementById('showTaxBtn');
const showGoldBtn = document.getElementById('showGoldBtn');
const showBothBtn = document.getElementById('showBothBtn');
const taxSection = document.getElementById('taxSection');
const goldSection = document.getElementById('goldSection');
const calculateTaxBtn = document.getElementById('calculateTaxBtn');

// Gold Chart Buttons
const btn7d = document.getElementById('btn7d');
const btn30d = document.getElementById('btn30d');
const btn90d = document.getElementById('btn90d');
const dateRangeButtons = document.querySelectorAll('.date-range-buttons button');

// --- Event Listeners for Module Visibility ---
showTaxBtn.addEventListener('click', () => {
    taxSection.classList.remove('hidden');
    goldSection.classList.add('hidden');
});

showGoldBtn.addEventListener('click', () => {
    taxSection.classList.add('hidden');
    goldSection.classList.remove('hidden');
    updateActiveButton(btn30d);
    renderGoldChart(30); // Default to 30 days
});

showBothBtn.addEventListener('click', () => {
    taxSection.classList.remove('hidden');
    goldSection.classList.remove('hidden');
    updateActiveButton(btn30d);
    renderGoldChart(30); // Default to 30 days
});

// --- Tax Calculation Logic (unchanged) ---
calculateTaxBtn.addEventListener('click', () => {
    const salaryInput = document.getElementById('salaryInput');
    const taxResultDiv = document.getElementById('taxResult');
    const taxAmountDiv = document.getElementById('taxAmount');
    
    const salary = Number(salaryInput.value);
    let category = '';
    let taxPayable = 0;
    const slabs = [ { limit: 400000, rate: 0.00, baseTax: 0 }, { limit: 800000, rate: 0.05, prevLimit: 400000, baseTax: 0 }, { limit: 1200000, rate: 0.10, prevLimit: 800000, baseTax: 20000 }, { limit: 1600000, rate: 0.15, prevLimit: 1200000, baseTax: 60000 }, { limit: 2000000, rate: 0.20, prevLimit: 1600000, baseTax: 120000 }, { limit: 2400000, rate: 0.25, prevLimit: 2000000, baseTax: 200000 }, { limit: Infinity, rate: 0.30, prevLimit: 2400000, baseTax: 300000 }];

    if (isNaN(salary) || salary <= 0) {
        category = 'Please enter a valid salary.';
        taxPayable = 0;
    } else if (salary <= slabs[0].limit) {
        category = `Up to Rs. 4 lakh`;
        taxPayable = 0;
    } else {
        for (let i = 1; i < slabs.length; i++) {
            if (salary <= slabs[i].limit) {
                category = `Rs. ${slabs[i].prevLimit / 100000} lakh to Rs. ${slabs[i].limit / 100000} lakh`;
                taxPayable = slabs[i].baseTax + (salary - slabs[i].prevLimit) * slabs[i].rate;
                break;
            }
        }
        if (salary > slabs[slabs.length - 1].prevLimit) {
            category = `Above Rs. 24 lakh`;
            taxPayable = slabs[slabs.length-1].baseTax + (salary - slabs[slabs.length-1].prevLimit) * slabs[slabs.length-1].rate;
        }
    }
    taxResultDiv.textContent = `Income Category: ${category}`;
    taxAmountDiv.textContent = taxPayable > 0 ? `Estimated Tax: Rs. ${taxPayable.toLocaleString('en-IN')}` : 'No Tax Payable';
});

// --- Gold Chart Logic (Updated) ---
let goldChartInstance = null;
// Master dataset for 90 days of gold prices (sample data)
const masterGoldData = [ 69850, 69900, 70100, 70050, 70200, 70350, 70300, 70500, 70450, 70600, 70750, 70700, 70900, 70850, 71000, 71150, 71100, 71300, 71250, 71400, 71550, 71500, 71700, 71650, 71800, 71950, 71900, 72100, 72050, 72200, 72350, 72300, 72500, 72450, 72600, 72750, 72700, 72900, 72850, 73000, 73150, 73100, 73300, 73250, 73400, 73550, 73500, 73700, 73650, 73800, 73950, 73900, 74100, 74050, 74200, 74350, 74300, 74500, 74450, 74600, 68500, 68700, 68650, 68900, 69100, 69000, 69250, 69300, 69150, 69500, 69700, 69600, 69850, 70100, 70000, 70250, 70300, 70150, 70500, 70400, 70650, 70800, 70700, 70950, 71100, 71000, 71250, 71400, 71300, 71500];

// Function to generate date labels
function generateDateLabels(days) {
    const labels = [];
    const today = new Date(); // Use current date
    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (days - 1 - i));
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return labels;
}

// Function to update the active state of buttons
function updateActiveButton(activeButton) {
    dateRangeButtons.forEach(button => button.classList.remove('active'));
    activeButton.classList.add('active');
}

// Main function to render or update the gold chart
function renderGoldChart(days) {
    const ctx = document.getElementById('goldChart').getContext('2d');
    const labels = generateDateLabels(days);
    const dataPoints = masterGoldData.slice(-days); // Get the last 'days' from the master data

    if (goldChartInstance) {
        // If chart exists, update its data
        goldChartInstance.data.labels = labels;
        goldChartInstance.data.datasets[0].data = dataPoints;
        goldChartInstance.update();
    } else {
        // If chart doesn't exist, create it
        goldChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Gold Price (per 10g)',
                    data: dataPoints,
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'top' } },
                scales: {
                    y: {
                        ticks: { callback: (value) => '₹' + value.toLocaleString('en-IN') }
                    }
                }
            }
        });
    }
}

// Event listeners for date range buttons
btn7d.addEventListener('click', () => {
    updateActiveButton(btn7d);
    renderGoldChart(7);
});
btn30d.addEventListener('click', () => {
    updateActiveButton(btn30d);
    renderGoldChart(30);
});
btn90d.addEventListener('click', () => {
    updateActiveButton(btn90d);
    renderGoldChart(90);
});
