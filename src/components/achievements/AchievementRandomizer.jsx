import Panel from "../ui/Panel";
import { useState, useEffect } from "react";
import AchievementItem from "./AchievememtItem";
import './AchievementRandomizer.css';

export default function AchievementRandomizer(props) {
    const [active_game, setActiveGame] = useState(null);
    const [validAchievements, setValidAchievements] = useState([]);
    const [choosen_achievements, setChoosenAchievements] = useState([]);
    const [activeAppId, setActiveAppId] = useState("");

    useEffect(() => {
        if (!activeAppId) return;

        setActiveGame(null);
        setValidAchievements([]);
        setChoosenAchievements([]);

        fetch(`/.netlify/functions/getAchievement?steamid=${props.activeSteamId}&appid=${activeAppId}`)
          .then(response => response.json())
          .then(pulled_data => {
            if (!pulled_data.gameName) return;
            setActiveGame(pulled_data);
          })
          .catch(error => console.error("Error fetching achievements:", error));
          
    }, [props.activeSteamId, activeAppId]);

    useEffect(() => {
        let valid_achs = [];
        active_game?.achievements.forEach(ach => {
            if (ach.progress === null || !ach.progress?.isCompleted) {
                valid_achs.push(ach);
            }
        });
        setValidAchievements(valid_achs);
    }, [active_game]);

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

    // --- NEW SORTING LOGIC ---
    // Create a sorted copy of the games array to keep it alphabetical
    const sortedGames = props.games 
        ? [...props.games].sort((a, b) => a.name.localeCompare(b.name)) 
        : [];

    return (
        <Panel className="achievement-randomizer">
            <h2>Achievement Randomizer</h2>

            <div className="game-selector-container" style={{ marginBottom: '20px', textAlign: 'center' }}>
                <label htmlFor="game-select" style={{ marginRight: '10px' }}>Select Game:</label>
                <select 
                    id="game-select" 
                    value={activeAppId} 
                    onChange={(e) => setActiveAppId(e.target.value)}
                >
                    <option value="" disabled>-- Choose a game to load --</option>
                    
                    {sortedGames.map(game => (
                        <option key={game.appid} value={game.appid}>
                            {game.name}
                        </option>
                    ))}
                </select>
            </div>

            {activeAppId && active_game ? (
                <>
                    <form className="randomizer-options" onSubmit={onSubmitHandler}>
                        <div>
                            <label htmlFor="achievement-count">Number of Achievements to Randomize</label>
                            <input type="number" name="achievement-count" id="achievement-count" min="1" max={validAchievements.length || 1000} defaultValue="1" />
                        </div>
                        <button className="randomize-btn" type="submit" disabled={validAchievements.length === 0}>
                            Randomize!
                        </button>
                    </form>

                    {validAchievements.length === 0 && (
                        <p style={{ textAlign: 'center', marginTop: '10px' }}>No locked achievements left for this game!</p>
                    )}
                </>
            ) : activeAppId && !active_game ? (
                <p style={{ textAlign: 'center' }}>Loading achievements...</p>
            ) : null}

            {
                choosen_achievements.length > 0 && (
                    <div>
                        <h3>Achievement{choosen_achievements.length > 1 ? 's' : ''} to work on today</h3>
                        <ul className="randomized-achievements-list">
                            {choosen_achievements.map((ach, index) => (
                                <li key={`${ach.id}-${index}`}>
                                    <AchievementItem name={ach.name} description={ach.description} appid={ach.appid} icon={ach.icon} />
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            }
        </Panel>
    );
}