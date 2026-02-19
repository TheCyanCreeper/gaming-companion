// src/App.jsx
import { useEffect, useState } from 'react'
import './App.css'
import GamePlaytimeList from './components/games/GamePlaytimeList'
import UserProfile from './components/profile/UserProfile' // New component

function App() {
  const [game_data, setGameData] = useState(null)
  const [profileData, setProfileData] = useState(null) // State for profile

  const DEFAULT_STEAM_ID = '76561198118095520'
  const [inputSteamId, setInputSteamId] = useState(DEFAULT_STEAM_ID)
  const [activeSteamId, setActiveSteamId] = useState(DEFAULT_STEAM_ID)

  useEffect(() => {
    setGameData(null)
    setProfileData(null) // Reset profile on new search

    // Fetch Games...
    fetch(`/.netlify/functions/getGames?steamid=${activeSteamId}`)
      .then(response => response.json())
      .then(pulled_data => {
        if (!pulled_data.response || !pulled_data.response.games) {
            setGameData([]); 
            return;
        }
        const formatted_games = pulled_data.response.games.map(game => {
          let lastPlayedDate = game.rtime_last_played !== 0 
            ? new Date(game.rtime_last_played * 1000).toLocaleDateString() 
            : "Never"
          if (lastPlayedDate === 'Invalid Date') lastPlayedDate = 'Unknown'

          return {
            appid: game.appid,
            name: game.name, 
            playtime: (game.playtime_forever / 60).toFixed(1),
            lastPlayed: lastPlayedDate
          }
        })
        setGameData(formatted_games)
      })

    // Fetch Profile
    fetch(`/.netlify/functions/getProfile?steamid=${activeSteamId}`)
    .then(response => response.json())
    .then(data => {
      // Steam returns players in an array
      if (data.response && data.response.players && data.response.players.length > 0) {
        setProfileData(data.response.players[0]);
      }
    })
    .catch(error => console.error('Error fetching profile:', error))
  }, [activeSteamId])

  const handleSearch = () => setActiveSteamId(inputSteamId)

  return (
    <>
      <h1>Welcome to your gaming companion</h1>
      
      {/* Show profile if data exists */}
      {profileData && <UserProfile profile={profileData} />}

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