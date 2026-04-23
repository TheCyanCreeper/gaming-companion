import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom' // Update your imports!
import './App.css'
import GamePlaytimeList from './components/games/GamePlaytimeList'
import UserProfile from './components/profile/UserProfile'
import NavBar from './components/nav/NavBar'
import GameRandomizer from './components/games/GameRandomizer'
import AchievementRandomizer from './components/achievements/AchievementRandomizer'

function App() {
  const [game_data, setGameData] = useState(null)
  const [profileData, setProfileData] = useState(null)

  const DEFAULT_STEAM_ID = '76561198118095520'
  const INITIAL_STEAM_ID = localStorage.getItem('lastSearchedSteamId') || DEFAULT_STEAM_ID
  const [inputSteamId, setInputSteamId] = useState(INITIAL_STEAM_ID)
  const [activeSteamId, setActiveSteamId] = useState(INITIAL_STEAM_ID)
  const [current_tab, setCurrentTab] = useState(0)

  useEffect(() => {
    setGameData(null)
    setProfileData(null)

    // Fetch Games
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
      if (data.response && data.response.players && data.response.players.length > 0) {
        setProfileData(data.response.players[0]);
      }
    })
    .catch(error => console.error('Error fetching profile:', error))
  }, [activeSteamId])

  const handleSearch = async () => {
    try {
      const response = await fetch(`/.netlify/functions/resolveUser?username=${inputSteamId}`);
      const resolveData = await response.json();

      if (resolveData.success) {
        const finalSteamId = resolveData.steamid;
        localStorage.setItem('lastSearchedSteamId', finalSteamId);
        setActiveSteamId(finalSteamId);
      } else {
        alert("User not found! Please check the custom URL name.");
      }
    } catch (error) {
      console.error("Error resolving username:", error);
      alert("Something went wrong trying to find that user.");
    }
  }

  return (
    <BrowserRouter>
      <NavBar onSelectTab={setCurrentTab} />
      
      
      <div className="steam-id-search">
        <input 
            type="text" 
            value={inputSteamId} 
            onChange={(e) => setInputSteamId(e.target.value)} 
            placeholder="Enter Steam64 ID or Custom Profile URL"
            className="steam-id-input"
            onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
            }}
        />
        <button onClick={handleSearch} className="steam-id-btn">Load Profile</button>
      </div>

      {profileData && <UserProfile profile={profileData} />}

      <main>
        <Routes>
          <Route 
            path="/" 
            element={<GamePlaytimeList data={game_data} inputSteamId={inputSteamId} />} 
          />
          <Route 
            path="/achievements" 
            element={<AchievementRandomizer activeSteamId={activeSteamId} games={game_data || []} />} 
          />
          <Route 
            path="/game-randomizer" 
            element={<GameRandomizer inventory={game_data} />} 
          />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App