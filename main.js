// Functionality to hide loader and show content when page is fully loaded
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  const content = document.getElementById("content");
  if (loader) {
    loader.style.display = "none";
  }
  if (content) {
    content.style.display = "block";
  }
});
// theme dark/light toggle functionality
const btnThemeDark = document.querySelector(".btn-theme-dark");
const btnThemeLight = document.querySelector(".btn-theme-light");
const body = document.body;
const recipeRow = document.querySelector(".row");
const recipeDetails = document.querySelector(".recipe-details");
const recipeCloseBtn = document.querySelector(".recipe-close-btn");

btnThemeLight.addEventListener("click", () => {
  body.classList.add("bg-white");
  body.classList.remove("bg-black");
  btnThemeLight.style.display = "none";
  btnThemeDark.style.display = "block";
});
btnThemeDark.addEventListener("click", () => {
  body.classList.add("bg-black");
  body.classList.remove("bg-white");
  btnThemeDark.style.display = "none";
  btnThemeLight.style.display = "block";
});
// end theme dark/light toggle functionality

// search functionality and fetching data from API
const searchBox = document.querySelector(".search-box");
const searchBtn = document.querySelector(".search-btn");

// fetch API meal and display cards
const fetchRecipe = async (query) => {
  try {
    recipeRow.innerHTML = `<h2 class="recipe-title my-4">Ongoing research...</h2>`;
    const encoded = encodeURIComponent(query);
    const data = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${encoded}`
    );
    const response = await data.json();
    recipeRow.innerHTML = "";

    if (!response || !response.meals) {
      recipeRow.innerHTML = "<h2 class='recipe-title my-4'>No meals found. Please use the keywords English</h2>";
      return;
    }

    response.meals.forEach((meal) => {
      const recipeDiv = document.createElement("div");
      recipeDiv.classList.add(
        "col-12",
        "col-xxl-3",
        "col-xl-4",
        "my-2",
        "col-md-6"
      );
      recipeDiv.innerHTML = `
        <div class="card-article m-1">
            <div class="img"><img src="${meal.strMealThumb}" alt=""></div>
            <div class="card-body p-3">
                <h2 class="title-card-body">${meal.strMeal}</h2>
                <p class="text-card-body">${meal.strMeal} is an ${meal.strCategory} meal from the ${meal.strArea}</p>
            </div>
        </div>
      `;
      const button = document.createElement("button");
      button.classList.add("openUp");
      button.textContent = "View recipe";
      button.addEventListener("click", () => openRecipePopup(meal));

      const cardBody = recipeDiv.querySelector(".card-body");
      if (cardBody) cardBody.appendChild(button);

      recipeRow.appendChild(recipeDiv);
    });
  } catch (err) {
    console.error(err);
    recipeRow.innerHTML =
      "<h2 class='recipe-title my-4'>Error during meal retrieval.</h2>";
  }
};

// ...existing code...
const fetchIngredients = (meal) => {
  let ingredientsList = "";
  for (let i = 1; i <= 80; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      const measure = meal[`strMeasure${i}`];
      ingredientsList += `<li>${measure} ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredientsList;
};
const openRecipePopup = (meal) => {
  recipeDetails.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <h5 class="title text-decoration-underline">Ingredient : </h5>
    <ul class="d-flex ingredient-list">${fetchIngredients(meal)}</ul>
    <h5 class="title text-decoration-underline">Instruction : </h5>
    <p>${meal.strInstructions}</p>
    `;
  recipeDetails.parentElement.style.display = "flex";
};

// display recipe of meal
recipeCloseBtn.addEventListener("click", () => {
  recipeDetails.parentElement.style.display = "none";
});
// end display recipe of meal


// modified search handler: send raw text to detection/translation, then normalise for the API
searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const raw = searchBox.value.trim();
  if (raw) {
    // Simulated language detection/translation step
    const detectedLanguage = "en"; // Placeholder for detected language
    let query = raw;  
    if (detectedLanguage !== "en") {
      // Placeholder for translation logic
      query = raw; // Assume translation to English
    }
    fetchRecipe(query);
  }

});
