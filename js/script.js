// ============================
// GLOBAL VARIABLES
// ============================

const API_BASE = "https://api.restcountries.com/countries/v5";

const countriesList = document.getElementById("countries-list-selector");
const generateCountryInfoButton = document.getElementById("generate-country-info-button");

// Selected country details
const officialName = document.getElementById("country-official-names");
const featuredCountry = document.getElementById("country-featured");
const commonName = document.getElementById("common-name");
const population = document.getElementById("ct-population");
const borders = document.getElementById("ct-borders");
const region = document.getElementById("ct-region");
const fifa = document.getElementById("ct-fifa");
const drivingSide = document.getElementById("ct-driving-side");
const subRegion = document.getElementById("ct-sub-region");
const languages = document.getElementById("ct-languages");
const capital = document.getElementById("ct-capital");
const currencyName = document.getElementById("ct-currency-name");
const currencySymbol = document.getElementById("ct-currency-symbol");
const area = document.getElementById("ct-area");
const googleMaps = document.getElementById("ct-google-maps");
const flag = document.getElementById("flag");
const coatOfArms = document.getElementById("coat-of-arms");
const coatOfArmsSection = document.getElementById("coat-of-arms-section");
const defaultCountryInfo = document.getElementById("default-info-country");
const defaultCountryFlagsInfo = document.getElementById("default-info-flags");

// Country info sections
const countryInfoList = document.getElementById("country-info-list");
const countryFlagsInfo = document.getElementById("country-flags");

// Hide country details by default
countryInfoList.style.display = "none";
countryFlagsInfo.style.display = "none";


// ============================
// HELPERS
// ============================

// Every v5 response is either { data: { objects, meta } } or { errors: [{ message }] }.
// Centralize that unwrapping so both fetches below can share it.
function parseApiResponse(response) {
    return response.json().then(body => {
        if (!response.ok || body.errors) {
            const message =
                (body.errors && body.errors[0] && body.errors[0].message) ||
                `Request failed with status ${response.status}.`;
            throw new Error(message);
        }
        return body.data;
    });
}

function authHeaders() {
    return { "Authorization": `Bearer ${CONFIG.API_KEY}` };
}


// ============================
// LOAD COUNTRY OPTIONS
// ============================

function loadCountryOptions() {

    // The free plan caps `limit` at 100 per page, and there are 250+ countries,
    // so we page through with offset until meta.more is false.
    function fetchPage(offset) {

        const url =
            `${API_BASE}?response_fields=names.official&limit=100&offset=${offset}`;

        return fetch(url, { headers: authHeaders() })
            .then(parseApiResponse)
            .then(data => {

                data.objects.forEach(country => {

                    const option = document.createElement("option");
                    const officialCountryName = country.names.official;

                    option.textContent = officialCountryName;
                    option.value = officialCountryName;

                    countriesList.add(option);
                });

                if (data.meta.more) {
                    return fetchPage(offset + data.meta.limit);
                }
            });
    }

    fetchPage(0)
        .catch(error => {
            console.error(error);

            defaultCountryInfo.textContent =
                `Sorry, country list not available: ${error.message}`;
        });

    generateCountryInfoButton.addEventListener(
        "click",
        generateCountryInfo
    );
}


// ============================
// GENERATE COUNTRY INFO
// ============================

function generateCountryInfo() {

    const selectedCountry = countriesList.value;

    if (!selectedCountry) {
        alert("Please select a country first.");
        return;
    }

    // Exact-match, case-insensitive lookup by official name.
    fetch(
        `${API_BASE}/names.official/${encodeURIComponent(selectedCountry)}`,
        { headers: authHeaders() }
    )
        .then(parseApiResponse)
        .then(data => {

            const country = data.objects[0];

            // Hide default text
            defaultCountryInfo.style.display = "none";
            defaultCountryFlagsInfo.style.display = "none";

            // Show generated content
            countryInfoList.style.display = "block";
            countryFlagsInfo.style.display = "block";

            // Basic info
            officialName.textContent = country.names.official;
            featuredCountry.textContent = country.names.official;
            commonName.textContent = country.names.common;
            population.textContent = country.population.toLocaleString();

            // Borders
            borders.textContent =
                country.borders && country.borders.length
                    ? country.borders.join(", ")
                    : "None";

            // Region details
            region.textContent = country.region || "N/A";
            subRegion.textContent = country.subregion || "N/A";

            // FIFA membership
            fifa.textContent =
                country.codes?.fifa || "Not a FIFA member";

            // Driving side
            drivingSide.textContent =
                country.cars?.driving_side || "Unknown";

            // Languages (array of { name, bcp47, ... })
            languages.textContent =
                country.languages && country.languages.length
                    ? country.languages.map(lang => lang.name).join(", ")
                    : "N/A";

            // Capital city (array of { name, primary, coordinates })
            capital.textContent =
                country.capitals && country.capitals.length
                    ? country.capitals.map(cap => cap.name).join(", ")
                    : "N/A";

            // Currency (array of { code, name, symbol })
            if (country.currencies && country.currencies.length) {

                currencyName.textContent =
                    country.currencies[0]?.name || "N/A";

                currencySymbol.textContent =
                    country.currencies[0]?.symbol || "N/A";

            } else {

                currencyName.textContent = "N/A";
                currencySymbol.textContent = "N/A";
            }

            // Area
            area.textContent =
                country.area?.kilometers
                    ? `${country.area.kilometers.toLocaleString()} km²`
                    : "N/A";

            // Google Maps
            googleMaps.textContent = "Open Google Maps";
            googleMaps.href = country.links?.google_maps || "#";
            googleMaps.target = "_blank";

            // Flag
            flag.src = country.flag?.url_png || "/img/noflag.png";
            flag.alt = `${country.names.common} flag`;

            // Coat of Arms: not part of the v5 field set, so the whole
            // section (heading included) is hidden rather than left
            // showing a heading over a broken image.
            coatOfArmsSection.style.display = "none";
        })
        .catch(error => {

            console.error(error);

            defaultCountryInfo.style.display = "block";
            defaultCountryInfo.textContent =
                `Sorry, country information could not be loaded: ${error.message}`;
        });
}


// ============================
// INITIALIZE APP
// ============================

document.addEventListener(
    "DOMContentLoaded",
    loadCountryOptions
);