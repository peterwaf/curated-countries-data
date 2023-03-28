//global variables
const countriesList = document.getElementById("countries-list-selector")
let generateCountryInfoButton = document.getElementById("generate-country-info-button")
function loadCountryOptions() {

    //load countries on select items

    loadCountries = fetch("https://restcountries.com/v3.1/all").then(response =>
        response.json()
    ).then(countries => {
        countries.forEach(country => {
            let option = document.createElement("option");
            countryCommonName = country.name.common //also to be used as option text, id and value
            option.innerText = country.name.common
            option.setAttribute("id", countryCommonName) // add option id
            option.setAttribute("value", countryCommonName)
            countriesList.add(option);
        });
    }
    ).catch(
        error => {
            console.error(error)
        }
    )
}

function generateCountryInfo() {
    // use https://restcountries.com/v3.1/name/{name} to grab individual country info
    let urlPartOne = "https://restcountries.com/v3.1/name/"
    const countriesList = document.getElementById("countries-list-selector")
    let optionCollectedValue = countriesList.value
    console.log(optionCollectedValue)
}


document.addEventListener("load", loadCountryOptions)

//add event listener into the document to generate the loadCountryOptions function

generateCountryInfoButton.addEventListener("click", generateCountryInfo)
//generateCountryInfoButton.addEventListener("click",generateCountryInfo())

