const salaryInput = document.getElementById('salaryInput');
const calculateBtn = document.getElementById('calculateBtn');
const resultDiv = document.getElementById('result');
const taxAmountDiv = document.getElementById('taxAmount');

calculateBtn.addEventListener('click', () => {
    const salary = Number(salaryInput.value);
    let category = '';
    let taxPayable = 0;

    // Tax Slabs and Rates for FY 2025-26
    const slabs = [
        { limit: 400000, rate: 0.00, baseTax: 0 },
        { limit: 800000, rate: 0.05, prevLimit: 400000, baseTax: 0 }, // (8L - 4L) * 5% = 20,000
        { limit: 1200000, rate: 0.10, prevLimit: 800000, baseTax: 20000 }, // 20k + (12L - 8L) * 10% = 20k + 40k = 60,000
        { limit: 1600000, rate: 0.15, prevLimit: 1200000, baseTax: 60000 }, // 60k + (16L - 12L) * 15% = 60k + 60k = 120,000
        { limit: 2000000, rate: 0.20, prevLimit: 1600000, baseTax: 120000 }, // 120k + (20L - 16L) * 20% = 120k + 80k = 200,000
        { limit: 2400000, rate: 0.25, prevLimit: 2000000, baseTax: 200000 }, // 200k + (24L - 20L) * 25% = 200k + 100k = 300,000
        { limit: Infinity, rate: 0.30, prevLimit: 2400000, baseTax: 300000 } // Above 24L
    ];

    if (isNaN(salary) || salary < 0) {
        category = 'Please enter a valid positive number.';
        taxPayable = 0;
    } else if (salary <= slabs[0].limit) {
        category = `Up to Rs. ${slabs[0].limit / 100000} lakh`;
        taxPayable = 0;
    } else {
        for (let i = 1; i < slabs.length; i++) {
            if (salary <= slabs[i].limit) {
                category = `Rs. ${slabs[i].prevLimit / 100000} lakh to Rs. ${slabs[i].limit / 100000} lakh`;
                taxPayable = slabs[i].baseTax + (salary - slabs[i].prevLimit) * slabs[i].rate;
                break;
            }
        }
        // For the highest slab (Above Rs. 24 lakh)
        if (salary > slabs[slabs.length - 1].prevLimit && salary > 2400000) {
            category = `Above Rs. ${slabs[slabs.length - 1].prevLimit / 100000} lakh`;
            taxPayable = slabs[slabs.length - 1].baseTax + (salary - slabs[slabs.length - 1].prevLimit) * slabs[slabs.length - 1].rate;
        }
    }

    resultDiv.textContent = `Your income category is: ${category}`;
    if (taxPayable > 0) {
        taxAmountDiv.textContent = `Estimated Tax Payable: Rs. ${taxPayable.toLocaleString('en-IN')}`;
    } else if (salary > 0) {
        taxAmountDiv.textContent = `No Tax Payable`;
    } else {
        taxAmountDiv.textContent = ''; // Clear if invalid input
    }
});
