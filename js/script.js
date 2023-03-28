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
            console.log("API data not loading")
        }
    )
    // add event listener on the generate button to generate individual country details
    generateCountryInfoButton.addEventListener("click", (e)=>{
        generateCountryInfo()
    })
}

function generateCountryInfo() {
    // use https://restcountries.com/v3.1/name/{name} to grab individual country info
    let urlPartOne = "https://restcountries.com/v3.1/name/"
    let optionCollectedValue = countriesList.value
    let countryApiUrl = urlPartOne + optionCollectedValue
    console.log(countryApiUrl)
}

//add event listener into the document to generate the loadCountryOptions function

document.addEventListener("load",loadCountryOptions())





