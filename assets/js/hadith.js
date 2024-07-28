// hadith.js

function fetchRandomHadith() {
    fetch('http://localhost:5000/api/random-hadith')  
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Received hadith data:', data);
            displayHadith(data);
        })
        .catch(error => {
            console.error('Error fetching hadith:', error);
            document.getElementById('hadith-container').innerHTML = 'Failed to load hadith. Please try again later.';
        });
}

function displayHadith(data) {
    const hadithContainer = document.getElementById('hadith-container');
    hadithContainer.innerHTML = `
        <p><strong>Book:</strong> ${data.bookName || 'Unknown'}</p>
        <p><strong>Chapter:</strong> ${data.chapterNumber ? data.chapterNumber : 'N/A'} - ${data.chapterTitle || 'No Title'}</p>
        <p><strong>Hadith Number:</strong> ${data.hadithNumber || 'N/A'}</p>
        <p><strong>Narrator:</strong> ${data.englishNarrator || 'Unknown'}</p>
        <p><strong>Hadith:</strong> ${data.hadithEnglish || 'No text available'}</p>
    `;
}

// New function to handle email submission
function submitEmail(e) {
    e.preventDefault();
    const email = document.querySelector('input[name="email"]').value;
    
    fetch('http://localhost:5000/api/subscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Failed to subscribe. Please try again later.');
    });
}

// Updated function to initialize the page
function initPage() {
    fetchRandomHadith();

    const newHadithBtn = document.getElementById('new-hadith-btn');
    if (newHadithBtn) {
        newHadithBtn.addEventListener('click', function(e) {
            e.preventDefault();
            fetchRandomHadith();
        });
    }

    // Add event listener for email submission form
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', submitEmail);
    }
}

// Run the initialization function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initPage);