// Reads COUNTRIES_API_KEY from the environment variable that's already
// saved in the Netlify site's environment (Site settings > Environment
// variables). This runs server-side, so the key is never exposed to the
// browser.
exports.handler = async (event) => {
    const apiKey = process.env.COUNTRIES_API_KEY;

    if (!apiKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Server misconfiguration: COUNTRIES_API_KEY environment variable is not set."
            })
        };
    }

    // Anything the client appends after /.netlify/functions/countries
    // (e.g. /names.official/Kenya) is forwarded to the countries API.
    const extraPath = event.path.replace(/^.*\/countries/, "");

    const queryString = new URLSearchParams(
        event.queryStringParameters || {}
    ).toString();

    const url =
        `https://api.restcountries.com/countries/v5${extraPath}` +
        (queryString ? `?${queryString}` : "");

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${apiKey}`
            }
        });

        const data = await response.json();

        return {
            statusCode: response.status,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 502,
            body: JSON.stringify({
                error: `Failed to reach countries API: ${error.message}`
            })
        };
    }
};