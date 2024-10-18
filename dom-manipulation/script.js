let quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
let lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';
const serverUrl = 'https://jsonplaceholder.typicode.com/posts'; // Replace with your mock API endpoint

// Populate the dropdown menu with unique categories
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

// Fetch quotes from the server periodically
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(serverUrl);
        const serverQuotes = await response.json();
        
        resolveConflicts(serverQuotes);
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
    }
}

// Sync quotes with server data and resolve conflicts
function resolveConflicts(serverQuotes) {
    let conflictsResolved = false;

    serverQuotes.forEach(serverQuote => {
        const localQuote = quotes.find(q => q.id === serverQuote.id);

        if (!localQuote) {
            quotes.push(serverQuote);
            conflictsResolved = true;
        } else if (localQuote.text !== serverQuote.text || localQuote.category !== serverQuote.category) {
            localQuote.text = serverQuote.text;
            localQuote.category = serverQuote.category;
            conflictsResolved = true;
        }
    });

    if (conflictsResolved) {
        localStorage.setItem('quotes', JSON.stringify(quotes));
        populateCategories();
        filterQuotes();
        showNotification('Conflicts were resolved and data was updated.');
    }
}

// Notify user of conflict resolution or data update
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = 'notification';
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add a new quote and post it to the server
async function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };

        try {
            const response = await fetch(serverUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newQuote),
            });

            const savedQuote = await response.json();
            quotes.push(savedQuote);
            localStorage.setItem('quotes', JSON.stringify(quotes));

            populateCategories();
            filterQuotes();
            alert('Quote added successfully!');
        } catch (error) {
            console.error('Error posting new quote to server:', error);
        }
    } else {
        alert('Please enter both the quote and the category.');
    }
}

// Load quotes from local storage and initialize the application
document.addEventListener('DOMContentLoaded', () => {
    populateCategories();
    filterQuotes();

    // Periodically fetch quotes from the server to sync
    setInterval(fetchQuotesFromServer, 60000); // Fetch every 60 seconds
});

// Event listener for showing a random quote
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Sync quotes when the page loads
fetchQuotesFromServer();
