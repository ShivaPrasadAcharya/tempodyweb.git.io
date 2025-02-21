// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // References to DOM elements
    const contentForm = document.getElementById('content-form');
    const idInput = document.getElementById('id');
    const contentInput = document.getElementById('content');
    const codeInput = document.getElementById('code');
    const cardsContainer = document.getElementById('cards-container');
    
    // Auto-populate the code field with the current data array
    updateCodeField();
    
    // Display existing cards from data.js
    renderCards();
    
    // Handle form submission
    contentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form values
        const id = parseInt(idInput.value);
        const content = contentInput.value;
        
        // Create new data entry
        const newEntry = {
            id: id,
            content: content
        };
        
        // Add to data array (at the beginning to maintain descending order by ID)
        contentData.unshift(newEntry);
        
        // Sort array by ID (descending)
        contentData.sort((a, b) => b.id - a.id);
        
        // Update the code field
        updateCodeField();
        
        // Save to GitHub
        saveToGitHub();
        
        // Re-render cards
        renderCards();
        
        // Reset form
        contentForm.reset();
    });
    
    // Function to update the code field with the current data array
    function updateCodeField() {
        const dataArrayString = JSON.stringify(contentData, null, 2);
        codeInput.value = `const contentData = ${dataArrayString};`;
    }
    
    // Function to render cards based on the data array
    function renderCards() {
        // Clear existing cards
        cardsContainer.innerHTML = '';
        
        // Create a card for each data entry
        contentData.forEach(entry => {
            const card = document.createElement('div');
            card.className = 'card';
            
            const cardHeader = document.createElement('div');
            cardHeader.className = 'card-header';
            cardHeader.textContent = `ID: ${entry.id}`;
            
            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';
            
            const cardContent = document.createElement('div');
            cardContent.className = 'card-content';
            cardContent.textContent = entry.content;
            
            cardBody.appendChild(cardContent);
            card.appendChild(cardHeader);
            card.appendChild(cardBody);
            
            cardsContainer.appendChild(card);
        });
    }
});
