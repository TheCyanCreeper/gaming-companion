// netlify/functions/getGames.js

export const handler = async (event) => {
    // 1. Grab the steamId from the query string
    const steamid = event.queryStringParameters.steamid;

    const app_ids = event.queryStringParameters.appids;
    
    // 2. Safely grab our secret key from Netlify's environment
    const api_key = process.env.STEAM_API_KEY;

    // 3. Build the Steam URL
    const url = `https://api.steampowered.com/IPlayerService/GetAchievementsProgress/v1/?key=${api_key}&steamid=${steamid}&format=json${app_ids}&include_unvetted_apps=true`;

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