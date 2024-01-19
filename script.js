fetch('http://localhost:3000/books')
.then(response => response.json())
.then(books => displayBooks(books))
.catch(error => console.error('Error occured:', error))

function displayBooks(){
    
}