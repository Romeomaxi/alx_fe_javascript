async function syncQuotes() {
    try {
        const response = await fetch(serverUrl);
        const serverQuotes = await response.json();
        resolveConflicts(serverQuotes);
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
        showNotification('Data has been synced and conflicts resolved.');
    }
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
