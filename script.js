let books = [];
let shoppingCart=[];

fetch('http://localhost:3000/books')
.then(response => response.json())
.then(data => {
    books = data;
    displayBooks(books)})
.catch(error =>console.error('Error occured:', error))

//display home page

function displayBooks(books){
    const row = document.querySelector('#books-container .row'); //container holds all the books
    row.innerHTML='';

    books.forEach( //all books need their own card to display details, also aesthetics...
        book => {
            const col = document.createElement('div'); 
            col.className = 'col-md-4';

            const card = document.createElement('div');
            card.className = 'card';

            card.innerHTML = `
            <img src="${book.image}" class="class-img-top" alt="${book.title}">
            <div class="card-body">
                <h4 class="card-title">${book.title}</h4>
                <h5 class="card-author">by ${book.author}</h5>
                <p class="card-genre">${book.genre}</p>
                <p class="card-description">${book.description}</p>
                <p class="card-price">${book.price}</>
                <a href="#" class="btn btn-primary">Add to Cart</a>
            </div>`
            //modify add to cart button
            const addToCartButton = card.querySelector('.btn-primary');
            addToCartButton.dataset.bookId = book.id; //
            addToCartButton.addEventListener('click', function() {
              addToCart(book.id);
            });

            col.appendChild(card);
            row.appendChild(col);
        }
    );

}

//add to cart
function addToCart(bookId) {
    const bookToAdd = books.find(book => book.id === bookId);
    if (bookToAdd) {
      shoppingCart.push(bookToAdd);
      updateCartDisplay(); // another function to update the cart display
    }
  }

//update cart display
function updateCartDisplay(){
    
}
  

//filtering books

document.getElementById('genre-filter').addEventListener('change', function() {
    applyFilter();
  });
  
  function applyFilter() {
    const selectedGenre = document.getElementById('genre-filter').value;
    let filteredBooks = books; // Use the 'books' array
  
    if (selectedGenre !== 'all') {
      filteredBooks = filteredBooks.filter(book => book.genre === selectedGenre);
    }
    
    
    displayBooks(filteredBooks); // Call displayBooks with the filtered list
  }



