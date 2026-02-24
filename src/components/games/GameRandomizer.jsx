import Panel from "../ui/Panel";
import { useState } from "react";
import GameCard from "./GameCard";
import './GameRandomizer.css'

export default function GameRandomizer({inventory}) {
    const [choosen_games, setChoosenGames] = useState([])
    const onSubmitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const includeFree = formData.get('free-games') === 'on';
        const includeUnplayed = formData.get('unplayed-games') === 'on';
        const gameCount = parseInt(formData.get('game-count'), 10);

        let new_choosen_games = []
        let random_pool = [...inventory];

        // if (!includeFree) {
        //     random_pool = random_pool.filter(game => game.price !== 0);
        // }
        for (let i = 0; i < gameCount; i++) {
            const randomIndex = Math.floor(Math.random() * random_pool.length);
            new_choosen_games.push(random_pool[randomIndex]);
            random_pool.splice(randomIndex, 1);
            if (random_pool.length === 0) break; // Stop if we run out of games to choose from
        }
        setChoosenGames(new_choosen_games)
    }

    console.log(choosen_games)
    return (
        <Panel>
            <h2>Game Randomizer</h2>
            <form onSubmit={onSubmitHandler}>
                <label htmlFor="free-games">Include Free Games</label>
                <input type="checkbox" name="free-games" id="free-games" />
                <label htmlFor="unplayed-games">Include Unplayed Games</label>
                <input type="checkbox" name="unplayed-games" id="unplayed-games" />
                <label htmlFor="game-count">Number of Games to Randomize</label>
                <input type="number" name="game-count" id="game-count" min="1" max="1000" defaultValue="1" />
                <button type="submit">Randomize!</button>
            </form>
            {
                choosen_games.length > 0 && (
                    <div>
                        <h3>Randomized Games:</h3>
                        <ul className="randomized-games-list">
                            {choosen_games.map((game, index) => (
                                <li key={index}><GameCard game={game} isExpanded={false} onCardClick={() => {}} imageUrl={`https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`} highlighted_stat={null} /></li>
                            ))}
                        </ul>
                    </div>
                        )
            }
        </Panel>
    )
}