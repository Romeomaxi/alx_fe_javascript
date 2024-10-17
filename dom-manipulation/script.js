// JavaScript file (script.js)

// Array to hold quote objects
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" },
    { text: "Believe you can and you're halfway there.", category: "Inspiration" }
];

// Function to display a random quote using innerHTML
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = "No quotes available.";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><p><em>Category: ${randomQuote.category}</em></p>`;
}

// Function to dynamically create a form for adding a new quote
function createAddQuoteForm() {
    const formContainer = document.createElement('div');

    // Create input fields for the quote text and category
    const quoteInput = document.createElement('input');
    quoteInput.id = 'newQuoteText';
    quoteInput.type = 'text';
    quoteInput.placeholder = 'Enter a new quote';
    formContainer.appendChild(quoteInput);

    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';
    formContainer.appendChild(categoryInput);

    // Create the Add Quote button
    const addButton = document.createElement('button');
    addButton.id = 'addQuoteBtn';
    addButton.textContent = 'Add Quote';
    formContainer.appendChild(addButton);

    // Append the form container to the body
    document.body.appendChild(formContainer);

    // Event listener for the Add Quote button
    addButton.addEventListener('click', addQuote);
}

// Function to add a new quote
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value.trim();
    const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (quoteText === '' || quoteCategory === '') {
        alert('Please enter both the quote text and the category.');
        return;
    }

    // Add the new quote to the array
    const newQuote = { text: quoteText, category: quoteCategory };
    quotes.push(newQuote);

    // Clear the input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    // Update the quote display with the newly added quote
    showRandomQuote();

    alert('Quote added successfully!');
}

// Event listeners for the buttons
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Call createAddQuoteForm to dynamically add the quote form to the page
document.addEventListener('DOMContentLoaded', () => {
    createAddQuoteForm();
    showRandomQuote();
});
