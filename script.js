

// **************************************************************

const searchBox = document.querySelector(".searchBox");
const searchBtn = document.querySelector(".searchButton");
const recipeContainer = document.querySelector(".recipe-container");
const recipeDetailsContent = document.querySelector(".recipe-details-content"); // Fixed selector
const recipeCloseBtn = document.querySelector(".recipe-close-btn");

// Function to get Recipes
const fetchRecipes = async () => {
  recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";
  try {
    
  const data = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchBox.value}`
  );
  const response = await data.json();
  recipeContainer.innerHTML = "";

    response.meals.forEach((meal) => {
      const recipeDiv = document.createElement("div");
      recipeDiv.classList.add("recipe");
      recipeDiv.innerHTML = `
        <img src="${meal.strMealThumb}">
        <h3>${meal.strMeal}</h3>
        <p><span>${meal.strArea}</span> Dish</p>
        <p>Belongs to <span>${meal.strCategory}</span> Category</p>`;

      const button = document.createElement("button");
      button.textContent = "View Recipe";
      recipeDiv.appendChild(button);

      // Add event listener to recipe button
      button.addEventListener("click", () => {
        openRecipePopup(meal);
      });

      recipeContainer.appendChild(recipeDiv);
    });
  } 
   catch (error) {
    recipeContainer.innerHTML = "<h2>Error in Fetching Recipes...</h2>";
  }
}


// Function to fetch ingredients and measurements
const fetchIngredients = (meal) => {
  let ingredientsList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient) {
      ingredientsList += `<li>${measure} ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredientsList;
};

// Function to open the recipe popup
const openRecipePopup = (meal) => {
  recipeDetailsContent.innerHTML = `
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul class="ingredientList">${fetchIngredients(meal)}</ul>
    <div class="recipeInstruction">
      <h3>Instructions</h3>
      <p>${meal.strInstructions}</p>
    </div>`;
  recipeDetailsContent.parentElement.style.display = "block";
};

// Close the recipe popup
recipeCloseBtn.addEventListener("click", () => {
  recipeDetailsContent.parentElement.style.display = "none";
});

// Search button event listener
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchInput = searchBox.value.trim();
  if(!searchInput){
    recipeContainer.innerHTML = `<h2>Type the meal in the search Box</h2>`;
    return;
  }
  fetchRecipes(searchInput);
});