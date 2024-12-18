const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("results");
const historyList = document.getElementById("history");

// Funkce pro načítání dat z API
async function fetchRecipes(query) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
  const data = await response.json();
  displayResults(data.meals);
  saveToHistory(query);
}

// Zobrazení výsledků
function displayResults(meals) {
  resultsDiv.innerHTML = ""; // Vyčištění předchozích výsledků

  if (!meals) {
    resultsDiv.innerHTML = "<p>Žádné recepty nenalezeny.</p>";
    return;
  }

  meals.forEach(meal => {
    const mealDiv = document.createElement("div");
    mealDiv.classList.add("result-item");
    mealDiv.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <div>
        <h3>${meal.strMeal}</h3>
        <a href="${meal.strYoutube}" target="_blank">Podívat se na video</a>
      </div>
    `;
    resultsDiv.appendChild(mealDiv);
  });
}

// Uložení do historie
function saveToHistory(query) {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  if (!history.includes(query)) {
    history.push(query);
    localStorage.setItem("searchHistory", JSON.stringify(history));
    loadHistory();
  }
}

// Načtení historie z LocalStorage
function loadHistory() {
  historyList.innerHTML = "";
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    li.addEventListener("click", () => fetchRecipes(item));
    historyList.appendChild(li);
  });
}

// Event listener pro tlačítko hledat
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchRecipes(query);
  }
});

// Načíst historii při načtení stránky
loadHistory();
