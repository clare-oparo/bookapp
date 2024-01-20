let books = [];
let shoppingCart=[];
let comments = [];
let currentEditingCommentId = null;

//get request

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
                <p class="card-title"><strong>${book.title}</strong></p>
                <p class="card-author"><em>by ${book.author}</em></p>
                <p class="card-genre"><strong>${book.genre}</strong></p>
                
                <p class="card-description">${shortenText(book.description, 100, book.id)}</p>
                <button class="btn btn-dark btn-sm read-more" onclick="toggleReadMore(${book.id})">Read More...</button>
                <br></br>
                <p class="btn btn-warning btn-sm"><strong>${book.price}</strong></p>
                <a href="#" class="btn btn-info btn-sm"><strong>Add to Cart</strong></a>
            </div>`
            //modify add to cart button
            const addToCartButton = card.querySelector('.btn-info');
            addToCartButton.dataset.bookId = book.id; //
            addToCartButton.addEventListener('click', function() {
              addToCart(book.id);
            });

            col.appendChild(card);
            row.appendChild(col);
        }
    );

}

//read more descriptions
function shortenText(text, maxLength, id) {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...' + `<span id="more-${id}" style="display: none;">` + text.substr(maxLength) + '</span>';
}

function toggleReadMore(id) {
  const moreText = document.getElementById(`more-${id}`);
  moreText.style.display = moreText.style.display === 'none' ? '' : 'none';
}


//add to cart
function addToCart(bookId) {
  const bookToAdd = books.find(book => book.id === bookId);
  if (bookToAdd) {
    const existingItem = shoppingCart.find(item => item.book.id === bookId);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      shoppingCart.push({ book: bookToAdd, quantity: 1 });
    }
    updateCartDisplay();
  }
}


//update cart display
function updateCartDisplay() {
  const cartCount = document.getElementById('cart-count');
  const cartItemsElement = document.getElementById('cart-items');

  cartCount.textContent = shoppingCart.reduce((total, item) => total + item.quantity, 0);

  cartItemsElement.innerHTML = '';

  shoppingCart.forEach((cartItem, index) => {
    const item = document.createElement('li');
    item.className = 'dropdown-item';
    item.textContent = `${cartItem.book.title} (Qty: ${cartItem.quantity})`;

    const increaseButton = document.createElement('button');
    increaseButton.className = 'btn btn-success btn-sm ms-2';
    increaseButton.textContent = '+';
    increaseButton.onclick = () => increaseQuantity(index);
    item.appendChild(increaseButton);


    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-danger btn-sm';
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteFromCart(index);
    item.appendChild(deleteButton);

    
    cartItemsElement.appendChild(item);
  });
}


//increase from cart
function increaseQuantity(index) {
  shoppingCart[index].quantity++;
  updateCartDisplay();
}

//delete from cart
function deleteFromCart(index) {
  if (shoppingCart[index].quantity > 1) {
    shoppingCart[index].quantity--;
  } else {
    shoppingCart.splice(index, 1);
  }
  updateCartDisplay();
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

//comments area

function displayComments() {
  const commentsContainer = document.getElementById('commentsContainer');
  commentsContainer.innerHTML = '';
  comments.forEach(comment => {
    const commentElement = document.createElement('div');
    commentElement.innerText = comment.text;

    const editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.onclick = () => setCommentToEdit(comment.id);
    commentElement.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.onclick = () => deleteComment(comment.id);
    commentElement.appendChild(deleteButton);

    commentsContainer.appendChild(commentElement);
  });
}

function setCommentToEdit(commentId) {
  const commentToEdit = comments.find(c => c.id === commentId);
  if (commentToEdit) {
    document.getElementById('commentTextArea').value = commentToEdit.text;
    currentEditingCommentId = commentId;
  }
}

function addComment(commentText) {
  const newComment = {
    id: Date.now().toString(),
    text: commentText
  };
  comments.push(newComment);
  displayComments();
}

function editComment(commentId, newText) {
  const comment = comments.find(c => c.id === commentId);
  if (comment) {
    comment.text = newText;
    displayComments();
  }
}

function deleteComment(commentId) {
  comments = comments.filter(c => c.id !== commentId);
  displayComments();
}

document.getElementById('submitComment').addEventListener('click', function() {
  const commentText = document.getElementById('commentTextArea').value;
  if (currentEditingCommentId) {
    editComment(currentEditingCommentId, commentText);
    currentEditingCommentId = null; // Clear the current editing ID
  } else {
    addComment(commentText);
  }
  document.getElementById('commentTextArea').value = ''; // Clear the textarea
});


