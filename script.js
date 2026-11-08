const BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w300";
const moviesEl = document.getElementById("movies");
const headingEl = document.getElementById("heading");

async function getMovies(path) {
  const sep = path.includes("?") ? "&" : "?";
  const res = await fetch(`${BASE}${path}${sep}api_key=${API_KEY}`);
  const data = await res.json();
  return data.results || [];
}

function showMovies(movies) {
  moviesEl.innerHTML = "";
  movies.filter(m => m.poster_path).forEach(m => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<img src="${IMG + m.poster_path}" alt="${m.title}">
                      <p>${m.title} ⭐ ${m.vote_average.toFixed(1)}</p>`;
    card.onclick = () => showRecommendations(m);
    moviesEl.appendChild(card);
  });
}

async function showRecommendations(movie) {
  headingEl.textContent = `Because you liked "${movie.title}"`;
  showMovies(await getMovies(`/movie/${movie.id}/recommendations`));
  window.scrollTo(0, 0);
}

document.getElementById("search").addEventListener("keydown", async e => {
  if (e.key === "Enter" && e.target.value.trim()) {
    headingEl.textContent = `Results for "${e.target.value}"`;
    showMovies(await getMovies(`/search/movie?query=${encodeURIComponent(e.target.value)}`));
  }
});

(async () => showMovies(await getMovies("/trending/movie/week")))();