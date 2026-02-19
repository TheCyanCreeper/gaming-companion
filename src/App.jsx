import { useEffect, useState } from 'react'
import './App.css'
import GamePlaytimeList from './components/games/GamePlaytimeList'

function App() {
  const [game_data, setGameData] = useState(null)

  const DEFAULT_STEAM_ID = '76561198118095520' // miget098
  
  // 1. New States for the Steam ID
  const [inputSteamId, setInputSteamId] = useState(DEFAULT_STEAM_ID) // For the text box
  const [activeSteamId, setActiveSteamId] = useState(DEFAULT_STEAM_ID) // The ID currently being fetched


  // 2. Add activeSteamId to the dependency array so it refetches when changed!
  useEffect(() => {
    const interface_name = 'IPlayerService'
    const method_name = 'GetOwnedGames'
    const version = '0001'
    const api_key = import.meta.env.VITE_STEAM_API_KEY
    const format = 'json'

    // Clear old data to trigger the "Loading..." screen
    setGameData(null)

    // Clear out all the old Steam API URL stuff, and just ask the backend
    fetch(`/.netlify/functions/getGames?steamid=${activeSteamId}`)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(pulled_data => {
        // Catch empty/private profiles safely
        if (!pulled_data.response || !pulled_data.response.games) {
            setGameData([]); 
            return;
        }

        const game_data = [];
        pulled_data.response.games.forEach(game => {
            let lastPlayedString = "Never";
            if (game.rtime_last_played !== 0) {
                const dateObj = new Date(game.rtime_last_played * 1000);
                lastPlayedString = dateObj.toLocaleDateString();
            }

            game_data.push({
                appid: game.appid,
                name: game.name, 
                playtime: (game.playtime_forever / 60).toFixed(1),
                lastPlayed: lastPlayedString,
                playtimeWindows: (game.playtime_windows_forever / 60).toFixed(1),
                playtimeMac: (game.playtime_mac_forever / 60).toFixed(1),
                playtimeLinux: (game.playtime_linux_forever / 60).toFixed(1)
            })
        })
        setGameData(game_data)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
        setGameData([]) // Fallback so it doesn't load forever
      })

    fetch(`/.netlify/functions/getProfile?steamid=${activeSteamId}`)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then(profile_data => {
      console.log("Profile data:", profile_data);
    })
    .catch(error => {
      console.error('Error fetching profile data:', error);
    })
  }, [activeSteamId])

  // 3. Triggered when the user clicks the "Search" button
  const handleSearch = () => {
      setActiveSteamId(inputSteamId)
  }

  return (
    <>
      <h1>Welcome to your gaming companion</h1>
      <GamePlaytimeList 
          data={game_data} 
          inputSteamId={inputSteamId}
          onInputChange={(e) => setInputSteamId(e.target.value)}
          onSearch={handleSearch}
      />
    </>
  )
}

export default App