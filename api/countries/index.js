module.exports = async function handler(req, res) {
    const apiKey = process.env.COUNTRIES_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            error: "Server misconfiguration: COUNTRIES_API_KEY environment variable is not set."
        });
    }

    const byOfficialName = req.query.by_official_name;
    const extraPath = byOfficialName
        ? `/names.official/${encodeURIComponent(byOfficialName)}`
        : "";

    const query = new URLSearchParams();

    for (const [key, value] of Object.entries(req.query)) {
        if (key === "by_official_name") {
            continue;
        }

        if (Array.isArray(value)) {
            value.forEach(item => query.append(key, item));
        } else if (value !== undefined) {
            query.append(key, value);
        }
    }

    const url =
        `https://api.restcountries.com/countries/v5${extraPath}` +
        (query.toString() ? `?${query.toString()}` : "");

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${apiKey}`
            }
        });

        const data = await response.json();

        return res
            .status(response.status)
            .setHeader("Content-Type", "application/json")
            .send(JSON.stringify(data));
    } catch (error) {
        return res.status(502).json({
            error: `Failed to reach countries API: ${error.message}`
        });
    }
};
