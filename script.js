// --- Element Selectors ---
const showTaxBtn = document.getElementById('showTaxBtn');
const showGoldBtn = document.getElementById('showGoldBtn');
const showBothBtn = document.getElementById('showBothBtn');
const taxSection = document.getElementById('taxSection');
const goldSection = document.getElementById('goldSection');
const calculateTaxBtn = document.getElementById('calculateTaxBtn');

// --- Event Listeners for Module Visibility ---
showTaxBtn.addEventListener('click', () => {
    taxSection.classList.remove('hidden');
    goldSection.classList.add('hidden');
});

showGoldBtn.addEventListener('click', () => {
    taxSection.classList.add('hidden');
    goldSection.classList.remove('hidden');
    renderGoldChart(); // Render chart when section is shown
});

showBothBtn.addEventListener('click', () => {
    taxSection.classList.remove('hidden');
    goldSection.classList.remove('hidden');
    renderGoldChart(); // Render chart when section is shown
});

// --- Tax Calculation Logic ---
calculateTaxBtn.addEventListener('click', () => {
    const salaryInput = document.getElementById('salaryInput');
    const taxResultDiv = document.getElementById('taxResult');
    const taxAmountDiv = document.getElementById('taxAmount');
    
    const salary = Number(salaryInput.value);
    let category = '';
    let taxPayable = 0;

    const slabs = [
        { limit: 400000, rate: 0.00, baseTax: 0 },
        { limit: 800000, rate: 0.05, prevLimit: 400000, baseTax: 0 },
        { limit: 1200000, rate: 0.10, prevLimit: 800000, baseTax: 20000 },
        { limit: 1600000, rate: 0.15, prevLimit: 1200000, baseTax: 60000 },
        { limit: 2000000, rate: 0.20, prevLimit: 1600000, baseTax: 120000 },
        { limit: 2400000, rate: 0.25, prevLimit: 2000000, baseTax: 200000 },
        { limit: Infinity, rate: 0.30, prevLimit: 2400000, baseTax: 300000 }
    ];

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


// --- Gold Chart Logic ---
let goldChartInstance = null; // To prevent creating multiple charts

function renderGoldChart() {
    if (goldChartInstance) {
        goldChartInstance.destroy(); // Destroy old chart before creating a new one
    }
    const ctx = document.getElementById('goldChart').getContext('2d');
    
    // Sample Data: 30 days of gold prices
    const labels = Array.from({length: 30}, (_, i) => `Day ${i + 1}`);
    const data = [
        68500, 68700, 68650, 68900, 69100, 69000, 69250, 69300, 69150, 69500,
        69700, 69600, 69850, 70100, 70000, 70250, 70300, 70150, 70500, 70400,
        70650, 70800, 70700, 70950, 71100, 71000, 71250, 71400, 71300, 71500
    ];

    goldChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Gold Price (per 10g)',
                data: data,
                borderColor: '#FFD700', // Gold color
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) { return '₹' + value.toLocaleString('en-IN'); }
                    }
                }
            }
        }
    });
}
