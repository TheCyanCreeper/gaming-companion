import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Card from './components/ui/Card'

import SortedList from './components/lists/SortedList'
import GamePlaytimeList from './components/games/GamePlaytimeList'

function App() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState(null)
  

  useEffect(() => {
    const interface_name = 'IPlayerService'
    const method_name = 'GetOwnedGames'
    const version = '0001'
    const api_key = import.meta.env.VITE_STEAM_API_KEY
    const user_id = '76561198118095520'
    const format = 'json'
    fetch(`/steam-api/${interface_name}/${method_name}/v${version}/?key=${api_key}&steamid=${user_id}&format=${format}&include_appinfo=1&include_played_free_games=1`)
      .then(response => response.json())
      .then(pulled_data => {
        // console.log(pulled_data)
        const game_data = [];
        pulled_data.response.games.forEach(game => {
            game_data.push({name: game.name, playtime: (game.playtime_forever / 60).toFixed(1)})
        })

        setData(game_data)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
      })

    const sortedData = data ? [...data].sort((a, b) => b.playtime - a.playtime) : null

    setData(sortedData)

    // fetch(`http://api.steampowered.com/${interface_name}/${method_name}/v${version}/?key=${api_key}&steamids=${user_id}&format=${format}`)
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log(data)
    //   })
    //   .catch(error => {
    //     console.error('Error fetching data:', error)
    //   })
  }, [])

  return (
    <>
      <h1>Welcome to your gaming companion</h1>
      <GamePlaytimeList data={data} />
    </>
  )
}

export default App
