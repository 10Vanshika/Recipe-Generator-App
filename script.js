const apiKey = "3ac93880aa6a4fc480133001eb40f7ad";
const resultsContainer = document.getElementById("results");
const mealDetails = document.getElementById("mealDetails");

async function searchMeal() {
  const query = document.getElementById("searchInput").value;
  const cuisine = document.getElementById("cuisineSelect").value;

  if (!query && !cuisine) {
    alert("Please enter a recipe name or select a cuisine.");
    return;
  }

  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${query}&cuisine=${cuisine}&number=12`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.results.length === 0) {
      resultsContainer.innerHTML = "<p>No recipes found.</p>";
      return;
    }

    renderRecipes(data.results);
  } catch (err) {
    console.error(err);
    resultsContainer.innerHTML = "<p>Something went wrong!</p>";
  }
}

function renderRecipes(recipes) {
  resultsContainer.innerHTML = recipes.map(recipe => `
    <div class="recipe-card">
      <img src="${recipe.image}" alt="${recipe.title}">
      <div class="info">
        <h3>${recipe.title}</h3>
        <button onclick="viewRecipe(${recipe.id})">View Full Recipe</button>
      </div>
    </div>
  `).join('');
  mealDetails.classList.add("hidden");
}

async function viewRecipe(id) {
  const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    mealDetails.innerHTML = `
      <img src="${data.image}" alt="${data.title}" />
      <h2>${data.title}</h2>
      <p><strong>Ready in:</strong> ${data.readyInMinutes} mins</p>
      <p><strong>Servings:</strong> ${data.servings}</p>
      <h3>Instructions:</h3>
      <p>${data.instructions || "Instructions not available."}</p>
      <button class="back-button" onclick="mealDetails.classList.add('hidden')">⬅ Back</button>
    `;
    mealDetails.classList.remove("hidden");
    window.scrollTo({ top: mealDetails.offsetTop, behavior: 'smooth' });
  } catch (err) {
    console.error(err);
    alert("Unable to load recipe.");
  }
}
