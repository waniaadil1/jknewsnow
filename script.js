const API_KEY = "0ea2bdb2e0714ed0a010339f866ae4b0";
const url = "https://newsapi.org/v2/everything?q=";

// Load default news category (Technology) on window load
window.addEventListener("load", () => fetchNews("technology"));

// Fetch news articles based on the given query
async function fetchNews(query) {
    try {
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await res.json();
        bindData(data.articles);
    } catch (error) {
        console.error("Error fetching the news:", error);
    }
}

// Bind news data to the DOM elements
function bindData(articles) {
    const cardsContainer = document.getElementById("cardscontainer");
    const sectionTitle = document.getElementById("section-title");

    // Clear previous news cards
    cardsContainer.innerHTML = "";

    // Set section title based on current category
    sectionTitle.textContent = capitalizeFirstLetter(curSelectedNav.id.split('-')[1]);

    // Populate the container with new news cards
    articles.forEach((article) => {
        if (!article.urlToImage) return;

        const cardHtml = `
            <div class="news-item">
                <img src="${article.urlToImage}" alt="${article.title}">
                <h3>${article.title.slice(0, 80)}...</h3>
                <p>${article.description.slice(0, 150)}...</p>
                <p>${new Date(article.publishedAt).toLocaleString("en-US", { timeZone: "Asia/Jakarta" })} - ${article.source.name}</p>
                <a href="${article.url}" target="_blank">Read More</a>
            </div>
        `;
        
        cardsContainer.insertAdjacentHTML('beforeend', cardHtml);
    });
}

// Handle navigation item clicks to fetch news
let curSelectedNav = document.getElementById("nav-technology"); // default selected nav
curSelectedNav.classList.add("active");

document.querySelectorAll('nav ul li a').forEach(item => {
    item.addEventListener('click', function() {
        curSelectedNav.classList.remove('active');
        curSelectedNav = item;
        curSelectedNav.classList.add('active');
        fetchNews(curSelectedNav.id.split('-')[1]);
    });
});

// Handle search button click to fetch news based on the search query
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value.trim();
    if (!query) return;

    fetchNews(query);
    curSelectedNav.classList.remove('active');
    curSelectedNav = null;
});

// Utility function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
