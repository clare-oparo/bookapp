document.addEventListener('DOMContentLoaded', function(){
    fetchBooks();
})

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
