exports.handler = async () => {
    const response = await fetch(
        "https://api.restcountries.com/countries/v5",
        {
            headers: {
                Authorization: `Bearer ${process.env.COUNTRIES_API_KEY}`
            }
        }
    );

    const data = await response.json();

    return {
        statusCode: 200,
        body: JSON.stringify(data)
    };
};