document.addEventListener('DOMContentLoaded', function(){
    fetchBooks();
})

//fetch from Google Books

function fetchBooks() {
    const apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=title';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const books = data.items.map(item => {
                return {
                    id: item.id,
                    title: item.volumeInfo.title,
                    author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown',
                    coverImageUrl: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : 'path/to/default-image.jpg'
                };
            });
            displayBooks(books);
        })
        .catch(error => console.error('Error:', error));
}

//display books on html
function displayBooks(books) {
    const booksDiv = document.getElementById('books');
    booksDiv.innerHTML = '';

    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'col-md-4 book-card';
        bookCard.innerHTML = `
            <div class="card">
                <img src="${book.coverImageUrl}" class="card-img-top" alt="${book.title}">
                <div class="card-body">
                    <h5 class="card-title">${book.title}</h5>
                    <p class="card-text">Author: ${book.author}</p>
                    <button class="btn btn-outline-secondary like-btn">Like</button>
                    <button class="btn btn-success" onclick="addToCart({ id: ${book.id}, title: '${book.title}', author: '${book.author}' })">Add to Cart</button>
                </div>
            </div>
        `;
        booksDiv.appendChild(bookCard);
    });

    setupLikeButtons();
}