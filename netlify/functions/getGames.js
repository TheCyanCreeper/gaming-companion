// netlify/functions/getGames.js

export const handler = async (event) => {
    // 1. Grab the steamId from the query string
    const steamid = event.queryStringParameters.steamid;
    
    // 2. Safely grab our secret key from Netlify's environment
    const api_key = process.env.STEAM_API_KEY;

    // 3. Build the Steam URL
    const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${api_key}&steamid=${steamid}&format=json&include_appinfo=1&include_played_free_games=1`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            return { statusCode: response.status, body: 'Error fetching from Steam' };
        }
        
        const data = await response.json();
        
        // 4. Send the data back to React (Netlify requires statusCode and body to be explicitly returned)
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch data from Steam' })
        };
    }
};