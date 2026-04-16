import Panel from "../ui/Panel";
import { useState, useEffect } from "react";
import AchievementItem from "./AchievememtItem";
import './AchievementRandomizer.css'

export default function AchievementRandomizer(props) {
    const [active_game, setActiveGame] = useState(null);
    const [validAchievements, setValidAchievements] = useState([]);
    const [choosen_achievements, setChoosenAchievements] = useState([]);
    const active_app_id = "526870";

    useEffect(() => {
        fetch(`/.netlify/functions/getAchievement?steamid=${props.activeSteamId}&appid=${active_app_id}`)
          .then(response => response.json())
          .then(pulled_data => {
            if (!pulled_data.gameName) return;
            console.log(pulled_data);
            setActiveGame(pulled_data);
          })
          .catch(error => console.error("Error fetching achievements:", error));

         
    }, [props.activeSteamId]);

    useEffect(() => {
        let valid_achs = []
        active_game?.achievements.forEach(ach => {
            if (ach.progress === null || !ach.progress?.isCompleted) {
                valid_achs.push(ach);
            }
        });
        setValidAchievements(valid_achs);
    }, [active_game])

    const onSubmitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const achCount = parseInt(formData.get('achievement-count'), 10);
        const random_achievements = [];

        for (let i = 0; i < achCount; i++) {
            const randomIndex = Math.floor(Math.random() * validAchievements.length);
            random_achievements.push(validAchievements[randomIndex]);
        }

        setChoosenAchievements(random_achievements);
    };

    return (
        
        <Panel className="achievement-randomizer">
            {console.log(validAchievements)}
            <h2>Achievement Randomizer</h2>
            <form className="randomizer-options" onSubmit={onSubmitHandler}>
            <div>
                <label htmlFor="achievement-count">Number of Achievements to Randomize</label>
                <input type="number" name="achievement-count" id="achievement-count" min="1" max="1000" defaultValue="1" />
            </div>

            <button className="randomize-btn" type="submit">Randomize!</button>
        </form>
        {
            choosen_achievements.length > 0 && (
                <div>
                    <h3>Achievement{choosen_achievements.length > 1 ? 's' : ''} to work on today</h3>
                    <ul className="randomized-achievements-list">
                        {choosen_achievements.map((ach, index) => (
                            <li key={ach.id}><AchievementItem name={ach.name} description={ach.description} appid={ach.appid} icon={ach.icon} /></li>
                        ))}
                    </ul>
                </div>
                    )
        }
        </Panel>
    );
}