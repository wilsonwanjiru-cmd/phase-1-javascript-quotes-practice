document.addEventListener('DOMContentLoaded', () => {
    const quoteList = document.querySelector('#quote-list');
    const form = document.querySelector('#new-quote-form');
  
    // Function to create a new quote card
    function createQuoteCard(quoteData) {
      const { id, quote, author, likes } = quoteData;
  
      const li = document.createElement('li');
      li.classList.add('quote-card');
  
      li.innerHTML = `
        <blockquote class="blockquote">
          <p class="mb-0">${quote}</p>
          <footer class="blockquote-footer">${author}</footer>
          <br>
          <button class='btn-success'>Likes: <span>${likes}</span></button>
          <button class='btn-danger'>Delete</button>
        </blockquote>
      `;
  
      // Delete button event listener
      const deleteBtn = li.querySelector('.btn-danger');
      deleteBtn.addEventListener('click', () => {
        deleteQuote(id, li);
      });
  
      // Like button event listener
      const likeBtn = li.querySelector('.btn-success');
      likeBtn.addEventListener('click', () => {
        likeQuote(id, likeBtn);
      });
  
      quoteList.appendChild(li);
    }
  
    // Function to fetch quotes and populate the page
    function fetchQuotes() {
      fetch('http://localhost:3000/quotes?_embed=likes')
        .then(response => response.json())
        .then(quotes => {
          quotes.forEach(quote => {
            createQuoteCard(quote);
          });
        });
    }
  
    // Function to handle form submission and create a new quote
    function handleFormSubmit(event) {
      event.preventDefault();
  
      const quoteInput = form.querySelector('input[name="quote"]');
      const authorInput = form.querySelector('input[name="author"]');
  
      const quote = quoteInput.value;
      const author = authorInput.value;
  
      createQuote(quote, author);
  
      quoteInput.value = '';
      authorInput.value = '';
    }
  
    // Function to create a new quote
    function createQuote(quote, author) {
      fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quote, author })
      })
        .then(response => response.json())
        .then(quoteData => {
          createQuoteCard(quoteData);
        });
    }
  
    // Function to delete a quote
    function deleteQuote(id, quoteCard) {
      fetch(`http://localhost:3000/quotes/${id}`, {
        method: 'DELETE'
      })
        .then(() => {
          quoteCard.remove();
        });
    }
  
    // Function to handle liking a quote
    function likeQuote(id, likeBtn) {
      fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quoteId: id })
      })
        .then(response => response.json())
        .then(likeData => {
          const likesSpan = likeBtn.querySelector('span');
          likesSpan.textContent = likeData.length;
        });
    }
  
    // Event listener for form submission
    form.addEventListener('submit', handleFormSubmit);
  
    // Fetch quotes and populate the page on initial load
    fetchQuotes();
  });
  