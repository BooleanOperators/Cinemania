export default async function renderMoviesCards(movies, selector) {
  const movieList = document.querySelector(selector);
  if (!movieList || !movies) {
    console.error("Invalid selector or empty movie list.");
    return;
  }
  let markup = "";
  for (const movie of movies) {
    const {
      id,
      backdrop_path: poster,
      title,
      release_date: date,
      vote_average: rating,
    } = movie;

    try {
      const [movieSrc, movieGenre, movieYear, starRating] = await Promise.all([
        getImg(poster, title),
        getGenre(id),
        getYear(date),
        createStarRating(rating),
      ]);

      markup += `<li id="${id}">
              <div class="movielist-item" data-id="${id}"
                   style="background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 63.48%, rgba(0, 0, 0, 0.9) 92.16%), 
                   url(${movieSrc});
                    background-repeat: no-repeat;
                    background-size: cover; 
                    background-position: center">
                    <div class="movielist__information-box">
                      <div class="movielist__title-box">
                        <p class ="movielist__movie-title">${title}</p>
                        <p class ="movielist__movie-genre"> ${movieGenre} | ${movieYear}</p>
                      </div>
                      <ul class="movielist__movie-rating">
                      ${starRating}
					            </ul>
					          </div>
              </div>
          </li>`;
    } catch (error) {
      console.error(`Error rendering movie - ID ${id}:`, error);
    }
  }
  movieList.innerHTML = markup;
}

function getYear(data) {
  if (!data) {
    return "There is no release date";
  }
  const year = data.slice(0, 4);
  return year;
}

// async function getGenre(id) { // skorzystać z api-service?

//propozycja optymalizacji AI
function createStarRating(data) {
  const rating = Math.round(data || 0);
  const fullStars = Math.floor(rating / 2);
  const halfStar = rating % 2 === 1 ? "★½" : "";
  const emptyStars = "☆".repeat(5 - fullStars - (halfStar ? 1 : 0));

  return `${"★".repeat(fullStars)}${halfStar}${emptyStars}`;
}

function getImg(poster) {
  return poster
    ? `https://image.tmdb.org/t/p/w780/${poster}`
    : `https://via.placeholder.com/300x450?text=${encodeURIComponent(title)}`;
}
