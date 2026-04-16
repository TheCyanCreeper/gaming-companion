export const handler = async (event) => {
    const steamid = event.queryStringParameters.steamid;
    const app_id = event.queryStringParameters.appid;
    const api_key = process.env.STEAM_API_KEY;

    // Quick guardrail to prevent empty requests
    if (!steamid || !app_id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing steamid or appid' })
        };
    }

    // 1. The three API endpoints we need
    const playerUrl = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${app_id}&key=${api_key}&steamid=${steamid}&format=json`;
    const schemaUrl = `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?appid=${app_id}&key=${api_key}&format=json`;
    const statsUrl = `https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=${app_id}&key=${api_key}&steamid=${steamid}&format=json`;

    try {
        // 2. Fetch all three simultaneously! 
        const [playerRes, schemaRes, statsRes] = await Promise.all([
            fetch(playerUrl),
            fetch(schemaUrl),
            fetch(statsUrl)
        ]);

        // If either of these two fail, we have to stop. The app can't run without them.
        if (!playerRes.ok) return { statusCode: playerRes.status, body: JSON.stringify({ error: `Error fetching player data: ${playerRes.statusText}` }) };
        if (!schemaRes.ok) return { statusCode: schemaRes.status, body: JSON.stringify({ error: `Error fetching game schema: ${schemaRes.statusText}` }) };

        const playerData = await playerRes.json();
        const schemaData = await schemaRes.json();
        
        // 3. Handle Stats Gracefully (The Defensive Part)
        let playerStats = [];
        if (statsRes.ok) {
            const statsData = await statsRes.json();
            // Dig into the JSON to grab the actual array of stats
            if (statsData.playerstats && statsData.playerstats.stats) {
                playerStats = statsData.playerstats.stats;
            }
        }

        // Extract the arrays we need to loop through
        const playerAchievements = playerData.playerstats.achievements || [];
        const schemaStats = schemaData.game.availableGameStats || {};
        const schemaAchievements = schemaStats.achievements || [];

        // 4. Merge everything together
        const mergedAchievements = playerAchievements.map((playerAch) => {
            // Find the dictionary details
            const details = schemaAchievements.find(schemaAch => schemaAch.name === playerAch.apiname);
            
            // --- PROGRESS MATCHING LOGIC ---
            let progressData = null;

            // If the player already unlocked it, no need for a progress bar!
            if (playerAch.achieved === 1) {
                progressData = { isCompleted: true };
            } else {
                // Attempt A: Does the schema explicitly give us the progress target? 
                if (details && details.progress && details.progress.value && details.progress.value.operand1) {
                    const targetStatName = details.progress.value.operand1;
                    const matchingStat = playerStats.find(s => s.name === targetStatName);
                    
                    if (matchingStat) {
                        progressData = {
                            current: matchingStat.value,
                            max: details.progress.max_val || "Unknown"
                        };
                    }
                } 
                // Attempt B: Fallback check. Does the game have a stat with the exact same name as the achievement?
                else {
                    const matchingStat = playerStats.find(s => s.name === playerAch.apiname);
                    if (matchingStat) {
                        progressData = {
                            current: matchingStat.value,
                            max: "Unknown" // We don't know the goal line, but we can at least show their current count
                        };
                    }
                }
            }
            
            return {
                id: playerAch.apiname,
                unlocked: playerAch.achieved === 1,
                unlockTime: playerAch.unlocktime,
                name: details?.displayName || "Hidden Achievement",
                description: details?.description || "Secret description.",
                icon: playerAch.achieved === 1 ? details?.icon : details?.icongray,
                progress: progressData // This will either be an object with numbers, { isCompleted: true }, or null.
            };
        });

        // 5. Send it to React
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                gameName: playerData.playerstats.gameName,
                achievements: mergedAchievements 
            })
        };

    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch data' }) };
    }
};