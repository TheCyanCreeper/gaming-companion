import Panel from "../ui/Panel";
import { useState, useEffect } from "react";

export default function AchievementRandomizer(props) {

    // useEffect(() => {
    //     let app_ids_query = '';
    //     props.games.forEach( (game, index) => {
    //         app_ids_query += `&appids5B${index}%5D=${game.appid}`;
    //     })
    
    //     fetch(`/.netlify/functions/getAchievements?steamid=${props.activeSteamId}${app_ids_query}`)
    //       .then(response => response.json())
    //       .then(pulled_data => {
    //         if (!pulled_data.response || !pulled_data.response.games) {
               
    //             return;
    //         }
    //         console.log(pulled_data)
    
           
    //         })
    //   }, [props.activeSteamId])

    return <Panel className="achievement-randomizer">
        <h2>Achievement Randomizer</h2>
    </Panel>
}