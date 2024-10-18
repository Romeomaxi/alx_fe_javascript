const serverUrl = 'https://jsonplaceholder.typicode.com/posts';

async function fetchQuotesFromServer() {
    try {
        const response = await fetch(serverUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const serverQuotes = await response.json();
        return serverQuotes.map(quote => ({
            id: quote.id,
            text: quote.body,
            category: 'General'
        }));
    } catch (error) {
        console.error('Error fetching quotes from the server:', error);
        return [];
    }
}

async function syncQuotes() {
    try {
        const serverQuotes = await fetchQuotesFromServer();
        resolveConflicts(serverQuotes);
        showNotification('Quotes synced with server!');
    } catch (error) {
        console.error('Error syncing quotes with the server:', error);
    }
}

function updateLocalStorageAndDOM() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
    populateCategories();
    filterQuotes();
}

function resolveConflicts(serverQuotes) {
    let isUpdated = false;

    serverQuotes.forEach(serverQuote => {
        const localQuote = quotes.find(q => q.id === serverQuote.id);

        if (!localQuote) {
            quotes.push(serverQuote);
            isUpdated = true;
        } else if (localQuote.text !== serverQuote.text || localQuote.category !== serverQuote.category) {
            localQuote.text = serverQuote.text;
            localQuote.category = serverQuote.category;
            isUpdated = true;
        }
    });

    if (isUpdated) {
        updateLocalStorageAndDOM();
    }
}

function showNotification(message) {
    const notificationElement = document.createElement('div');
    notificationElement.textContent = message;
    notificationElement.className = 'notification';
    document.body.appendChild(notificationElement);

    setTimeout(() => {
        notificationElement.remove();
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    populateCategories();
    filterQuotes();
    syncQuotes();
    setInterval(syncQuotes, 60000);
});

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
            savedQuote.category = newQuoteCategory;
            quotes.push(savedQuote);
            updateLocalStorageAndDOM();

            alert('Quote added successfully!');
            syncQuotes();
        } catch (error) {
            console.error('Error posting new quote to the server:', error);
        }
    } else {
        alert('Please enter both the quote and the category.');
    }
}
