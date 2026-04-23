export const handler = async (event) => {
    // We will call this parameter "username" (e.g., what the user typed in the box)
    const userInput = event.queryStringParameters.username;
    const api_key = process.env.STEAM_API_KEY;

    if (!userInput) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing username parameter' }) };
    }

    try {
        // 1. SMART CHECK: Did they already type a 17-digit Steam64 ID?
        // This regex checks if the string is exactly 17 numbers long.
        const isAlreadySteamId = /^\d{17}$/.test(userInput);

        if (isAlreadySteamId) {
            // No need to call the API, just hand it right back!
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ success: true, steamid: userInput })
            };
        }

        // 2. VANITY CHECK: It's a custom name. Ask Steam to translate it.
        const url = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${api_key}&vanityurl=${userInput}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            return { statusCode: response.status, body: JSON.stringify({ error: 'Steam API Error' }) };
        }

        const data = await response.json();

        // 3. HANDLE THE RESPONSE
        // Steam returns a "success" code of 1 if it found the user, and 42 if it didn't.
        if (data.response.success === 1) {
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ success: true, steamid: data.response.steamid })
            };
        } else {
            // Success code 42 means "No match"
            return {
                statusCode: 404,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ success: false, error: 'User not found. Check the custom URL name.' })
            };
        }

    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Server error while resolving user' }) };
    }
};