fetch('http://localhost:3000/books')
.then(response => response.json())
.then(books => displayBooks(books))
.catch(error =>console.error('Error occured:', error))

function displayBooks(books){
    const container = document.getElementById('books-container'); //container holds all the books
    container.innerHTML='';

    books.forEach( //all books need their own card to display details, also aesthetics...
        book => {
            const card = document.createElement('div'); 
            card.className = 'card';
            card.style.width = '18rem';

            card.innerHTML = `
            <img src="${book.image}" class="class-img-top" alt="${book.title}">
            <div class="card-body">
                <h4 class="card-title">${book.title}</h4>
                <h5 class="card-author">by ${book.author}</h5>
                <p class="card-genre">${book.genre}</p>
                <p class="card-description">${book.description}</p>
                <p class="card-price">${book.price}</>
                <a href=# class="btn btn-primary">Add to Cart</a>
            </div>`;

            container.appendChild(card);
        }
    )
}