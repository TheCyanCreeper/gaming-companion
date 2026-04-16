import Panel from "../ui/Panel";
import { useState, useEffect } from "react";
import AchievementItem from "./AchievememtItem";

export default function AchievementRandomizer(props) {

    useEffect(() => {
        let active_app_id = "620"
        let [active_game, setActiveGame] = useState(null)
        

        fetch(`/.netlify/functions/getAchievement?steamid=${props.activeSteamId}&appid=${active_app_id}`)
          .then(response => response.json())
          .then(pulled_data => {
            if (!pulled_data.gameName) return;
            console.log(pulled_data)
            setActiveGame(pulled_data)
           
            })
      }, [props.activeSteamId])

    return <Panel className="achievement-randomizer">
        <h2>Achievement Randomizer</h2>
        {!active_game?.gameName ? <p>Loading...</p> : 
            <>
            <h3>{active_game.gameName}</h3>
            <ul>
                {active_game.achievements.map(ach => (
                    <AchievementItem key={ach.id} name={ach.name} description={ach.description} />
                ))}
            </ul>
            </>
        }
        
    </Panel>
}