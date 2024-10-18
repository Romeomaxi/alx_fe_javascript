
let quotes = [];


function loadQuotes() {
    const storedQuotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    quotes = storedQuotes;
}


function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}


function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = "No quotes available.";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><p><em>Category: ${randomQuote.category}</em></p>`;


    sessionStorage.setItem('lastViewedQuote', randomIndex);
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
    saveQuotes();

    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    showRandomQuote();
    alert('Quote added successfully!');
}


function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(dataBlob);
    downloadLink.download = 'quotes.json';
    downloadLink.click();
}


function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            saveQuotes();
            showRandomQuote();
            alert('Quotes imported successfully!');
        } catch (e) {
            alert('Invalid JSON file.');
        }
    };
    fileReader.readAsText(event.target.files[0]);
}


document.addEventListener('DOMContentLoaded', () => {
    loadQuotes();
    createAddQuoteForm();
    showRandomQuote();


    const lastViewedQuoteIndex = sessionStorage.getItem('lastViewedQuote');
    if (lastViewedQuoteIndex !== null) {
        const quoteDisplay = document.getElementById('quoteDisplay');
        const lastQuote = quotes[Number(lastViewedQuoteIndex)];
        if (lastQuote) {
            quoteDisplay.innerHTML = `<p>"${lastQuote.text}"</p><p><em>Category: ${lastQuote.category}</em></p>`;
        }
    }
});


document.getElementById('newQuote').addEventListener('click', showRandomQuote);
const importFileInput = document.createElement('input');
importFileInput.type = 'file';
importFileInput.id = 'importFile';
importFileInput.accept = '.json';
importFileInput.onchange = importFromJsonFile;
document.body.appendChild(importFileInput);

const exportButton = document.createElement('button');
exportButton.textContent = 'Export Quotes';
exportButton.onclick = exportToJsonFile;
document.body.appendChild(exportButton);
