// api/getGames.js
// This code runs ONLY on the server. Browsers cannot see it!

export default async function handler(req, res) {
    // 1. Grab the steamId the React frontend sends us
    const { steamid } = req.query;
    
    // 2. Safely grab our secret key from the server environment
    const api_key = process.env.STEAM_API_KEY;

    // 3. Build the Steam URL (Notice it's the real steampowered.com URL!)
    const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${api_key}&steamid=${steamid}&format=json&include_appinfo=1&include_played_free_games=1`;

    try {
        // 4. Have the server ask Steam for the data
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Steam API responded with ${response.status}`);
        }
        
        const data = await response.json();
        
        // 5. Send that data back to your React frontend!
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch data from Steam' });
    }
}