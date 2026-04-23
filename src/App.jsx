import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GamePlaytimeList from './components/games/GamePlaytimeList'
import UserProfile from './components/profile/UserProfile'
import NavBar from './components/nav/NavBar'
import GameRandomizer from './components/games/GameRandomizer'
import AchievementRandomizer from './components/achievements/AchievementRandomizer'
import './App.css'

function App() {
  const DEFAULT_STEAM_ID = '76561198118095520';
  
  const [activeSteamId, setActiveSteamId] = useState(localStorage.getItem('lastSearchedSteamId') || DEFAULT_STEAM_ID)
  const [inputSteamId, setInputSteamId] = useState('')
  const [game_data, setGameData] = useState(null)
  const [profileData, setProfileData] = useState(null)
  const [current_tab, setCurrentTab] = useState(0)
  const [privacyError, setPrivacyError] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const steamIdFromLogin = urlParams.get('login_success');
    const loginError = urlParams.get('login_error');

    if (steamIdFromLogin) {
      localStorage.setItem('lastSearchedSteamId', steamIdFromLogin);
      setActiveSteamId(steamIdFromLogin);
      window.history.replaceState({}, document.title, "/"); 
    } else if (loginError) {
      alert("Steam login failed. Please try again.");
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  useEffect(() => {
    if (!activeSteamId) return;

    setGameData(null)
    setProfileData(null)
    setPrivacyError(false)

    fetch(`/.netlify/functions/getGames?steamid=${activeSteamId}`)
      .then(response => response.json())
      .then(pulled_data => {
        if (!pulled_data.response || !pulled_data.response.games) {
            setGameData([]); 
            if (pulled_data.response && Object.keys(pulled_data.response).length === 0) {
              setPrivacyError(true);
            }
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
      .catch(error => console.error(error))

    fetch(`/.netlify/functions/getProfile?steamid=${activeSteamId}`)
    .then(response => response.json())
    .then(data => {
      if (data.response && data.response.players && data.response.players.length > 0) {
        const player = data.response.players[0];
        setProfileData(player);
        if (player.communityvisibilitystate !== 3) {
          setPrivacyError(true);
        }
      }
    })
    .catch(error => console.error(error))
  }, [activeSteamId])

  const handleSteamLogin = () => {
    window.location.href = '/.netlify/functions/authLogin'; 
  };

  const handleSearch = async () => {
    if (!inputSteamId.trim()) return; 
    
    try {
      const response = await fetch(`/.netlify/functions/resolveUser?username=${inputSteamId}`);
      const resolveData = await response.json();

      if (resolveData.success) {
        const finalSteamId = resolveData.steamid;
        localStorage.setItem('lastSearchedSteamId', finalSteamId);
        setActiveSteamId(finalSteamId);
        setInputSteamId(''); 
      } else {
        alert("User not found! Please check the custom URL name or Steam64 ID.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong trying to find that user.");
    }
  }

  return (
    <BrowserRouter>
      <NavBar onSelectTab={setCurrentTab} />
      
      <div className="login-container">
          {!activeSteamId ? (
              <div className="login-options">
                  <button onClick={handleSteamLogin} className="steam-login-btn">
                      <img src="https://community.akamai.steamstatic.com/public/images/signinthroughsteam/sits_01.png" alt="Sign in through Steam" />
                  </button>
                  <span className="login-divider">— OR —</span>
                  <div className="steam-id-search">
                      <input 
                          type="text" 
                          value={inputSteamId} 
                          onChange={(e) => setInputSteamId(e.target.value)} 
                          placeholder="Enter Custom Profile URL or Steam64 ID"
                          className="steam-id-input"
                          onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSearch();
                          }}
                      />
                      <div className="tooltip-container">
                          <span className="tooltip-icon">?</span>
                          <div className="tooltip-text">
                              <strong>Custom URL:</strong> steamcommunity.com/id/<strong>your_name</strong><br /><br />
                              <strong>Steam64 ID:</strong> The 17-digit number found in your profile link if you haven't set a custom name.
                          </div>
                      </div>
                      <button onClick={handleSearch} className="steam-id-btn">Load Profile</button>
                  </div>
              </div>
          ) : (
              <div>
                  {profileData && <UserProfile profile={profileData} />}
                  <button className='logout-btn' onClick={() => {
                      localStorage.removeItem('lastSearchedSteamId');
                      setActiveSteamId(null);
                  }}>Change Profile / Logout</button>
              </div>
          )}
      </div>

      <main>
        {!activeSteamId ? (
            <div style={{ textAlign: 'center', marginTop: '60px', color: '#888' }}>
                <h2>No Profile Loaded</h2>
                <p>Sign in through Steam or enter a custom URL above to get started.</p>
            </div>
        ) : privacyError ? (
            <div className="privacy-error">
                <h3>Profile or Game Details are Private</h3>
                <p>We cannot load games or achievements because these Steam privacy settings are restricting access.</p>
                <p><strong>How to fix:</strong></p>
                <ol>
                    <li>Open Steam and go to your <strong>Profile</strong>.</li>
                    <li>Click <strong>Edit Profile</strong>.</li>
                    <li>Select <strong>Privacy Settings</strong> on the left.</li>
                    <li>Set <strong>My Profile</strong> and <strong>Game details</strong> to <strong>Public</strong>.</li>
                </ol>
            </div>
        ) : (
            <Routes>
              <Route 
                path="/" 
                element={<GamePlaytimeList data={game_data} inputSteamId={activeSteamId} />} 
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
        )}
      </main>
    </BrowserRouter>
  )
}

export default App