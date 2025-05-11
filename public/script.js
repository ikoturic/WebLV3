let cart = []; // Košarica za pohranu filmova
let filteredMovies = []; // Pohrana filtriranih filmova

// Funkcija za dohvaćanje filmova
function fetchMovies() {
    fetch('/movies')
        .then(response => response.json())
        .then(movies => {
            // Pohrana svih filmova
            filteredMovies = movies;
            displayMovies(filteredMovies); // Prikaz svih filmova kad stranica učita
        })
        .catch(error => console.error('Error fetching movies:', error));
}

// Funkcija za filtriranje filmova
function filterMovies(movies) {
    const genre = document.querySelector('#genre-filter').value.toLowerCase();
    const title = document.querySelector('#title-filter').value.toLowerCase();
    const minRating = parseFloat(document.querySelector('#rating-filter').value);

    return movies.filter(movie => {
        const matchesGenre = genre ? movie.genre.toLowerCase().includes(genre) : true;
        const matchesTitle = movie.title.toLowerCase().includes(title);
        const matchesRating = parseFloat(movie.avg_vote) >= minRating;

        return matchesGenre && matchesTitle && matchesRating;
    });
}

// Funkcija za rukovanje filtriranjem kada korisnik pritisne "Filtriraj"
function handleFilter() {
    const filtered = filterMovies(filteredMovies); // Filtriraj filmove na temelju kriterija
    displayMovies(filtered); // Ažuriraj tablicu s filtriranim filmovima
}

// Funkcija za prikaz filmova u tablici
function displayMovies(movies) {
    const tableBody = document.querySelector('#movies-table tbody');
    tableBody.innerHTML = ''; // Očisti postojeće redove prije nego što dodamo nove

    movies.forEach(movie => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${movie.filmtv_id}</td>
            <td>${movie.title}</td>
            <td>${movie.year}</td>
            <td>${movie.genre}</td>
            <td>${movie.duration}</td>
            <td>${movie.country}</td>
            <td>${movie.avg_vote}</td>
            <td><button class="add-to-cart" data-id="${movie.filmtv_id}">Dodaj u košaricu</button></td>
        `;
        tableBody.appendChild(row); // Dodaj red u tablicu
    });

    // Dodavanje event listenera za "Dodaj u košaricu" gumbove
    const addButtons = document.querySelectorAll('.add-to-cart');
    addButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Funkcija za dodavanje filma u košaricu
function addToCart(event) {
    const movieId = event.target.dataset.id;
    const movie = filteredMovies.find(movie => movie.filmtv_id === movieId);
    
    if (movie && !cart.includes(movie)) {
        cart.push(movie);
        updateCartDisplay();
    }
}

// Funkcija za ažuriranje prikaza košarice
function updateCartDisplay() {
    const cartTableBody = document.querySelector('#cart-table tbody');
    cartTableBody.innerHTML = ''; // Očisti postojeće redove prije nego što dodamo nove

    cart.forEach(movie => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${movie.title}</td>
            <td>${movie.year}</td>
            <td>${movie.genre}</td>
            <td><button class="remove-from-cart" data-id="${movie.filmtv_id}">Ukloni</button></td>
        `;
        cartTableBody.appendChild(row); // Dodaj red u košaricu
    });

    // Dodavanje event listenera za "Ukloni" gumbove
    const removeButtons = document.querySelectorAll('.remove-from-cart');
    removeButtons.forEach(button => {
        button.addEventListener('click', removeFromCart);
    });
}

// Funkcija za uklanjanje filma iz košarice
function removeFromCart(event) {
    const movieId = event.target.dataset.id;
    cart = cart.filter(movie => movie.filmtv_id !== movieId);
    updateCartDisplay();
}

// Funkcija za potvrdu posudbe
function confirmRent() {
    if (cart.length === 0) {
        alert("Košarica je prazna. Nema filmova za posudbu.");
    } else {
        alert(`Uspješno ste dodali ${cart.length} filmova u svoju košaricu za vikend maraton!`);
        cart = []; // Prazni košaricu nakon potvrde
        updateCartDisplay();
    }
}

// Event listener za gumb "Potvrdi posudbu"
document.querySelector('#confirm-rent').addEventListener('click', confirmRent);

// Event listener za filtriranje
document.querySelector('#filter-button').addEventListener('click', handleFilter);

// Pozivaj funkciju kad stranica bude učitana
document.addEventListener('DOMContentLoaded', fetchMovies);

// Ažuriranje vrijednosti slidera
document.querySelector('#rating-filter').addEventListener('input', (event) => {
    document.querySelector('#rating-value').textContent = event.target.value;
});
