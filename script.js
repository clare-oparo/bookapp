let cart=[];

document.addEventListener('DOMContentLoaded', function(){
    fetchBooks();
    setupSearch()
})

//fetch from Google Books

function fetchBooks() {
    const apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=rome';

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

//like buttons on book cards
function setupLikeButtons() {
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('liked');
            this.textContent = this.classList.contains('liked') ? 'Liked' : 'Like';
        });
    });
}

//all the cart functions: add to cart
function addToCart(book) {
    const existingBook = cart.find(item => item.id === book.id);
    if (existingBook) {
        existingBook.quantity++;
    } else {
        cart.push({ ...book, quantity: 1 });
    }
    displayCart();
}

//remove from cart

function removeFromCart(bookId) {
    cart = cart.filter(item => item.id !== bookId);
    displayCart();
}

//change quantity
function updateQuantity(bookId, quantity) {
    const book = cart.find(item => item.id === bookId);
    if (book) {
        book.quantity = quantity;
        displayCart();
    }
}

//display cart
function displayCart() {
    const cartDiv = document.getElementById('cart-items');
    cartDiv.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.innerHTML = `
            <p>${item.title} - ${item.quantity}</p>
            <button onclick="removeFromCart(${item.id})">Remove</button>
            <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)">
        `;
        cartDiv.appendChild(cartItem);
    });
}

//search
function setupSearch() {
    document.getElementById('book-search').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        document.querySelectorAll('.book-card').forEach(bookCard => {
            const title = bookCard.querySelector('.card-title').textContent.toLowerCase();
            bookCard.style.display = title.includes(searchTerm) ? '' : 'none';
        });
    });
}