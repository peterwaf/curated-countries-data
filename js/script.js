//global variables

const countriesList = document.getElementById("countries-list-selector")
let generateCountryInfoButton = document.getElementById("generate-country-info-button")

//selected single country details variables

let officialName = document.getElementById("country-official-names")
let commonName = document.getElementById("common-name")
let population = document.getElementById("ct-population")
let borders = document.getElementById("ct-borders")
let region = document.getElementById("ct-region")
let fifa = document.getElementById("ct-fifa")
let drivingSide = document.getElementById("ct-sdriving-side")
let subRegion = document.getElementById("ct-sub-region")
let languages = document.getElementById("ct-languages")
let capital = document.getElementById("ct-capital")
let currencyName = document.getElementById("ct-currency-name")
let currencySymbol = document.getElementById("ct-currency-symbol")
let area = document.getElementById("ct-area")
let googleMaps = document.getElementById("ct-google-maps")

function loadCountryOptions() {

    //load countries on select items

    fetch("https://restcountries.com/v3.1/all").then(response =>
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
    generateCountryInfoButton.addEventListener("click", (e) => {
        generateCountryInfo()
    })
}

function generateCountryInfo() {
    // use https://restcountries.com/v3.1/name/{name} to grab individual country info
    let urlPartOne = "https://restcountries.com/v3.1/name/"
    let optionCollectedValue = countriesList.value
    let countryApiUrl = urlPartOne + optionCollectedValue
    fetch(countryApiUrl).then(
        response => response.json()
    ).then(selectedCountryInfo => {
        selectedCountryInfo.forEach(singleCountryInfo => {
            officialName.textContent = singleCountryInfo.name.official
            commonName.textContent = singleCountryInfo.name.common
            population.textContent = singleCountryInfo.population

            //check if the country has borders

            if(singleCountryInfo.borders == null) {
                borders.textContent = "None"
            }
            else{
                borders.textContent = singleCountryInfo.borders
            }
            region.textContent = singleCountryInfo.region

            //check if the country is a member of fifa

            if(singleCountryInfo.fifa == null){
                fifa.textContent = "Not a Member of Fifa"
            }
            else{
                fifa.textContent = singleCountryInfo.fifa
            }
            drivingSide.textContent = singleCountryInfo.car.side

            //grab language values from laguage object of the api

            let allLanguages = Object.values(singleCountryInfo.languages)
            languages.textContent = allLanguages
            capital.textContent = singleCountryInfo.capital

            //grab currency keys from currencies object of the api
            console.log(singleCountryInfo.currencies)
            //grab currency object lists contained in an array
            let allCurrenciesList = Object.values(singleCountryInfo.currencies)
            currencyName.textContent= allCurrenciesList[0].name
            currencySymbol.textContent  = allCurrenciesList[0].symbol
            area.textContent = singleCountryInfo.area
            googleMaps.textContent = singleCountryInfo.maps.googleMaps
            
            //make google link to be clickable
            
            googleMaps.setAttribute("href",singleCountryInfo.maps.googleMaps)

            //make google link clickable in a new tab
            
            googleMaps.setAttribute("target","_blank")

        });
    })
}

//add event listener into the document to generate the loadCountryOptions function
document.addEventListener("load", loadCountryOptions())






