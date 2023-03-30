//global variables

const countriesList = document.getElementById("countries-list-selector")
let generateCountryInfoButton = document.getElementById("generate-country-info-button")

//selected single country details variables

let officialName = document.getElementById("country-official-names")
let featuredCountry = document.getElementById("country-featured")
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
let flag = document.getElementById("flag")
let coatOfArms = document.getElementById("coat-of-arms")
let defaultCountryInfo = document.getElementById("default-info-country")
let defaultCountryFlagsInfo = document.getElementById("default-info-flags")


//hide country info list by default

let countryInfoList = document.getElementById("country-info-list")
let countryFlagsInfo = document.getElementById("country-flags")
countryInfoList.style.display = "none"
countryFlagsInfo.style.display = "none"

function loadCountryOptions() {

    //load countries on select items

    fetch("https://restcountries.com/v3.1/all").then(response =>
        response.json()
    ).then(countries => {
        countries.forEach(country => {
            let option = document.createElement("option");
            countrySelectOfficialName = country.name.official //also to be used as option text, id and value
            option.innerText = country.name.official
            option.setAttribute("id", countrySelectOfficialName) // add option id
            option.setAttribute("value", countrySelectOfficialName)
            countriesList.add(option);
        });
    }
    ).catch(
        error => {
            console.error(error)
            defaultCountryInfo.textContent = "Sorry , data not available, please check your internet connection or try again later."+" "+error
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

        //hide default info

        defaultCountryInfo.style.display = "none"
        defaultCountryFlagsInfo.style.display = "none"

        //display generated content divs

        countryInfoList.style.display = "block"
        countryFlagsInfo.style.display = "block"
        selectedCountryInfo.forEach(singleCountryInfo => {
            officialName.textContent = singleCountryInfo.name.official
            featuredCountry.textContent = singleCountryInfo.name.official
            commonName.textContent = singleCountryInfo.name.common
            population.textContent = singleCountryInfo.population

            //check if the country has borders

            if (singleCountryInfo.borders == null) {
                borders.textContent = "None"
            }
            else {
                borders.textContent = singleCountryInfo.borders
            }
            region.textContent = singleCountryInfo.region

            //check if the country is a member of fifa

            if (singleCountryInfo.fifa == null) {
                fifa.textContent = "Not a Member of Fifa"
            }
            else {
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
            currencyName.textContent = allCurrenciesList[0].name
            currencySymbol.textContent = allCurrenciesList[0].symbol
            area.textContent = singleCountryInfo.area
            googleMaps.textContent = singleCountryInfo.maps.googleMaps

            //make google link to be clickable

            googleMaps.setAttribute("href", singleCountryInfo.maps.googleMaps)

            //make google link clickable in a new tab

            googleMaps.setAttribute("target", "_blank")

            //grab country and add the src attribute

            flag.setAttribute("src", singleCountryInfo.flags.png)

            //grab the coat of arms fland and add the src attribute

            coatOfArms.setAttribute("src", singleCountryInfo.coatOfArms.png)

        });
    }).catch(
        error => {
            console.error(error)
            defaultCountryInfo.textContent = "Sorry , data not available,please check your internet connection or try again later."+" "+error
        }
    )
}

//add event listener into the document to generate the loadCountryOptions function
document.addEventListener("load", loadCountryOptions())






