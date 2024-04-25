// THIS CODE FETCHES DATA ABOUT A COUNTRY FROM AN EXTERNAL API AND DISPLAYS IT ON THE PAGE.
// IT ALSO STORES THE RETRIEVED DATA IN LOCAL STORAGE AND DISPLAYS IT IF AVAILABLE.

// GET ELEMENTS FROM THE DOM
const searchBtn = document.getElementById("search-btn"); // BUTTON FOR SEARCHING COUNTRY
const countryInp = document.getElementById("country-inp"); // TEXT INPUT FOR COUNTRY NAME
const result = document.getElementById("result"); // ELEMENT TO DISPLAY RESULT

// FUNCTION TO UPDATE RESULT DISPLAY
const updateResult = (htmlContent) => {
  result.innerHTML = htmlContent;
};

// EVENT LISTENER FOR SEARCH BUTTON
searchBtn.addEventListener("click", async (event) => {
  event.preventDefault(); // PREVENTS DEFAULT FORM SUBMISSION BEHAVIOR
  const countryName = countryInp.value.trim(); // GETS INPUT COUNTRY NAME
  localStorage.setItem("textBoxValue", countryName); // SAVES COUNTRY NAME TO LOCAL STORAGE
  if (!countryName) {
    updateResult("<h3>The input field cannot be empty</h3>");
    return;
  }

  const finalURL = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`; // URL TO FETCH COUNTRY DATA

  try {
    const response = await fetch(finalURL); // FETCH DATA FROM API
    const data = await response.json(); // PARSE JSON RESPONSE

    if (data && data.length > 0) {
      const country = data[0]; // EXTRACT COUNTRY DATA
      // GENERATE HTML CONTENT WITH COUNTRY DETAILS
      const htmlContent = `
        <img src="${country.flags.png}" alt="${
        country.flags.alt
      }" class="flag-img">
        <h2>${country.name.common}</h2>
        <div class="wrapper">
            <div class="data-wrapper">
                <h4>Capital:</h4>
                <span>${country.capital[0]}</span>
            </div>
        </div>
        <div class="wrapper">
            <div class="data-wrapper">
                <h4>Continent:</h4>
                <span>${country.continents[0]}</span>
            </div>
        </div>
        <div class="wrapper">
            <div class="data-wrapper">
                <h4>Population:</h4>
                <span>${country.population}</span>
            </div>
        </div>
        <div class="wrapper">
            <div class="data-wrapper">
                <h4>Currency:</h4>
                <span>${
                  country.currencies[Object.keys(country.currencies)[0]].name
                } - ${Object.keys(country.currencies)[0]}</span>
            </div>
        </div>
        <div class="wrapper">
            <div class="data-wrapper">
                <h4>Common Languages:</h4>
                <span>${Object.values(country.languages).join(", ")}</span>
            </div>
        </div>
      `;
      updateResult(htmlContent); // DISPLAY COUNTRY DETAILS

      // STORE THE HTML CONTENT IN LOCAL STORAGE
      localStorage.setItem("countryData", htmlContent);
    } else {
      updateResult("<h3>Please enter a valid country name.</h3>");
      localStorage.clear(); // CLEAR LOCAL STORAGE IF NO DATA FOUND
    }
  } catch (error) {
    localStorage.clear(); // CLEAR LOCAL STORAGE ON ERROR
    console.error("Error fetching data:", error);
    updateResult("<h3>An error occurred. Please try again later.</h3>");
  }
});

// RETRIEVE AND DISPLAY STORED DATA FROM LOCAL STORAGE
const storedData = localStorage.getItem("countryData");
const textValue = localStorage.getItem("textBoxValue");
if (storedData) {
  countryInp.value = textValue;
  updateResult(storedData);
}
