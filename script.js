document.addEventListener('DOMContentLoaded', function () {
    const apiKey = '2faee55e44a70213021445464c03ef82';
    const movieContainer = document.getElementById('movieContainer');
    const movieSearchInput = document.getElementById('movieSearch');
    const genreList = document.getElementById('genreList');
    const modal = document.getElementById('modal');

    // Function to fetch Now Playing movies from TMDb API
    async function fetchNowPlayingMovies() {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching Now Playing movies:', error);
            return [];
        }
    }

    // Function to display movie cards
    function displayMovies(movies) {
        movieContainer.innerHTML = '';

        if (movies.length === 0) {
            movieContainer.innerHTML = 'No movies found.';
        }

        movies.forEach((movie) => {
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card';
            movieCard.dataset.movieId = movie.id;

            const title = document.createElement('h2');
            title.textContent = movie.title;
            title.className = 'ellipsis';

            const language = document.createElement('p');
            language.textContent = ` ${movie.original_language.toUpperCase()}`;
            language.className = 'card-language';

            const rating = document.createElement('p');
            rating.innerHTML = `
            <span class="star">&#9733;</span>
            <span class="rating">${movie.vote_average.toFixed(1)}</span>
            `;

            const image = document.createElement('img');
            image.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            image.alt = movie.title;

            movieCard.appendChild(image);
            movieCard.appendChild(title);
            movieCard.appendChild(language);
            movieCard.appendChild(rating);

            movieContainer.appendChild(movieCard);

            movieCard.addEventListener('click', async () => {
                const movieDetails = await fetchMovieDetails(movie.id);
                if (movieDetails) {
                    displayMovieDetails(movieDetails);
                }
            });
        });
    }

    // Function to fetch movie genres from TMDb API
    async function fetchMovieGenres() {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data.genres;
        } catch (error) {
            console.error('Error fetching movie genres:', error);
            return [];
        }
    }

    // Function to display genre options
    function displayGenres(genres) {
        const select = document.createElement('select');
        select.id = 'genreSelect';
        select.innerHTML = '<option value="">All Genres</option>';

        genres.forEach((genre) => {
            const option = document.createElement('option');
            option.value = genre.id;
            option.textContent = genre.name;
            select.appendChild(option);
        });

        genreList.appendChild(select);
    }

    // Event listener for genre filtering
    genreList.addEventListener('change', async () => {
        const selectedGenreId = document.getElementById('genreSelect').value;
        const movies = await fetchNowPlayingMovies();

        if (selectedGenreId) {
            const filteredMovies = movies.filter((movie) => movie.genre_ids.includes(parseInt(selectedGenreId)));
            displayMovies(filteredMovies);
        } else {
            displayMovies(movies);
        }
    });

    // Function to fetch additional movie details from TMDb API
    async function fetchMovieDetails(movieId) {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching movie details:', error);
            return null;
        }
    }

    // Function to display movie details in a pop-up
    function displayMovieDetails(movie) {
        modal.innerHTML = '';

        const modalWrapper = document.createElement('div');
        modalWrapper.className = 'modal-wrapper';

        const content = document.createElement('div');
        content.className = 'modal-content';

        const closeButton = document.createElement('button');
        closeButton.className = 'close-button';
        closeButton.textContent = 'X';
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        const image = document.createElement('img');
        image.className = 'movie-image';
        image.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        image.alt = movie.title;

        const details = document.createElement('div');
        details.className = 'movie-details';

        const title = document.createElement('h1');
        title.textContent = movie.title;

        const rating = document.createElement('p');
        rating.innerHTML = `
            <span class="rating-container">
            <span class="star-icon">&#9733;</span>
            <span class="rating-text">${movie.vote_average.toFixed(1)}/10</span>
            </span>
        `;

        const language = document.createElement('p');
        language.textContent = ` ${movie.original_language.toUpperCase()}`;
        language.id = 'language';

        const runtime = document.createElement('p');
        runtime.textContent = `${movie.runtime} minutes`;

        const genre = document.createElement('p');
        genre.textContent = movie.genres.map((genre) => genre.name).join(', ');

        const overview = document.createElement('p');
        overview.textContent = movie.overview;

        // Create a "Price" element and add it to the details
        const calculatedPrice = Math.floor(movie.runtime * 2);
        const price = document.createElement('p');
        price.textContent = `Price: ₹${calculatedPrice}`;

        // Create a "Book Ticket" button
        const bookTicketButton = document.createElement('button');
        bookTicketButton.textContent = 'Book Ticket';
        bookTicketButton.className = 'book-ticket-button';

        // Event listener for the "Book Ticket" button
        bookTicketButton.addEventListener('click', () => {
            // Redirect to the checkout page with movie details
            const checkoutData = {
                title: movie.title,
                price: calculatedPrice,
            };

            // Store the data in local storage for the checkout page to access
            localStorage.setItem('checkoutData', JSON.stringify(checkoutData));

            // Redirect to the checkout page
            window.location.href = 'checkout.html';
        });

        // Add elements to the modal
        details.appendChild(title);
        details.appendChild(rating);
        details.appendChild(language);
        details.appendChild(runtime);
        details.appendChild(genre);
        details.appendChild(overview);
        details.appendChild(price);
        details.appendChild(bookTicketButton);

        content.appendChild(closeButton);
        content.appendChild(image);
        content.appendChild(details);

        modalWrapper.appendChild(content);
        modal.appendChild(modalWrapper);

        modal.style.display = 'block';

        // Close the modal if the user clicks anywhere outside of it
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Event listener for search input
    movieSearchInput.addEventListener('input', async () => {
        const searchTerm = movieSearchInput.value.toLowerCase();
        const movies = await fetchNowPlayingMovies();

        if (searchTerm) {
            const filteredMovies = movies.filter((movie) =>
                movie.title.toLowerCase().includes(searchTerm)
            );
            displayMovies(filteredMovies);
        } else {
            displayMovies(movies);
        }
    });

    window.addEventListener('load', async () => {
        const movies = await fetchNowPlayingMovies();
        const genres = await fetchMovieGenres();
        displayMovies(movies);
        displayGenres(genres);
    });
});
