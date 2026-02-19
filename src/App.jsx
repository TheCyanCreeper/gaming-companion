import { useEffect, useState } from 'react'
import './App.css'
import GamePlaytimeList from './components/games/GamePlaytimeList'

function App() {
  const [data, setData] = useState(null)
  
  // 1. New States for the Steam ID
  const [inputSteamId, setInputSteamId] = useState('76561198118095520') // For the text box
  const [activeSteamId, setActiveSteamId] = useState('76561198118095520') // The ID currently being fetched

  // 2. Add activeSteamId to the dependency array so it refetches when changed!
  useEffect(() => {
    const interface_name = 'IPlayerService'
    const method_name = 'GetOwnedGames'
    const version = '0001'
    const api_key = import.meta.env.VITE_STEAM_API_KEY
    const format = 'json'

    // Clear old data to trigger the "Loading..." screen
    setData(null)

    // We clear out all the old Steam API URL stuff, and just ask our new backend!
    fetch(`/api/getGames?steamid=${activeSteamId}`)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(pulled_data => {
        // Catch empty/private profiles safely
        if (!pulled_data.response || !pulled_data.response.games) {
            setData([]); 
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
        setData(game_data)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
        setData([]) // Fallback so it doesn't load forever
      })
  }, [activeSteamId]) // <-- VERY IMPORTANT: Tells useEffect to run again when the ID changes

  // 3. Triggered when the user clicks the "Search" button
  const handleSearch = () => {
      setActiveSteamId(inputSteamId)
  }

  return (
    <>
      <h1>Welcome to your gaming companion</h1>
      <GamePlaytimeList 
          data={data} 
          // Pass our new state and functions down to the list
          inputSteamId={inputSteamId}
          onInputChange={(e) => setInputSteamId(e.target.value)}
          onSearch={handleSearch}
      />
    </>
  )
}

export default App