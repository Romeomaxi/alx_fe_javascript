let quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
let lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';


function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
    

    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    

    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });


    categoryFilter.value = lastSelectedCategory;
}


function filterQuotes() {
    const categoryFilter = document.getElementById('categoryFilter');
    const selectedCategory = categoryFilter.value;
    lastSelectedCategory = selectedCategory;
    

    localStorage.setItem('lastSelectedCategory', selectedCategory);
    
    const filteredQuotes = selectedCategory === 'all' 
        ? quotes 
        : quotes.filter(quote => quote.category === selectedCategory);
    
    displayQuotes(filteredQuotes);
}


function displayQuotes(quotesToDisplay) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = ''; // Clear previous quotes

    quotesToDisplay.forEach(quote => {
        const quoteElement = document.createElement('div');
        quoteElement.textContent = `"${quote.text}" - ${quote.category}`;
        quoteDisplay.appendChild(quoteElement);
    });
}


function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    
    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        localStorage.setItem('quotes', JSON.stringify(quotes));
        
        populateCategories(); 
        filterQuotes(); 

        alert('Quote added successfully!');
    } else {
        alert('Please enter both the quote and the category.');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    populateCategories();
    filterQuotes();
});


document.getElementById('exportQuotes').addEventListener('click', () => {
    const json = JSON.stringify(quotes, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});


function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        localStorage.setItem('quotes', JSON.stringify(quotes));
        populateCategories();
        filterQuotes();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}
