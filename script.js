// Get the elements from the HTML
const salaryInput = document.getElementById('salaryInput');
const calculateBtn = document.getElementById('calculateBtn');
const resultDiv = document.getElementById('result');

// Add an event listener to the button
calculateBtn.addEventListener('click', () => {
    // Get the salary value and convert it to a number
    const salary = Number(salaryInput.value);
    let category = '';

    // Check for invalid input
    if (isNaN(salary) || salary < 0) {
        category = 'Please enter a valid positive number.';
    } else if (salary <= 400000) {
        category = 'Up to Rs. 4 lakh (Nil Tax)';
    } else if (salary > 400000 && salary <= 800000) {
        category = 'Rs. 4 lakh to Rs. 8 lakh (5%)';
    } else if (salary > 800000 && salary <= 1200000) {
        category = 'Rs. 8 lakh to Rs. 12 lakh (10%)';
    } else if (salary > 1200000 && salary <= 1600000) {
        category = 'Rs. 12 lakh to Rs. 16 lakh (15%)';
    } else if (salary > 1600000 && salary <= 2000000) {
        category = 'Rs. 16 lakh to Rs. 20 lakh (20%)';
    } else if (salary > 2000000 && salary <= 2400000) {
        category = 'Rs. 20 lakh to Rs. 24 lakh (25%)';
    } else { // salary > 2400000
        category = 'Above Rs. 24 lakh (30%)';
    }

    // Display the result on the page
    resultDiv.textContent = `Your category is: ${category}`;
});