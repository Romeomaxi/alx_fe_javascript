let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" },
    { text: "Believe you can and you're halfway there.", category: "Inspiration" }
];


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


function createAddQuoteForm() {
   
    if (document.getElementById('addQuoteForm')) {
        return; 
    }


    const formContainer = document.createElement('div');
    formContainer.id = 'addQuoteForm';


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


    const addButton = document.createElement('button');
    addButton.id = 'addQuoteBtn';
    addButton.textContent = 'Add Quote';
    formContainer.appendChild(addButton);


    document.body.appendChild(formContainer);


    addButton.addEventListener('click', addQuote);
}


function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value.trim();
    const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (quoteText === '' || quoteCategory === '') {
        alert('Please enter both the quote text and the category.');
        return;
    }


    const newQuote = { text: quoteText, category: quoteCategory };
    quotes.push(newQuote);


    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';


    showRandomQuote();

    alert('Quote added successfully!');
}


document.getElementById('newQuote').addEventListener('click', showRandomQuote);


document.addEventListener('DOMContentLoaded', () => {
    createAddQuoteForm();
    showRandomQuote();
});
