import Card from "../ui/Card";
import SortedList from "../lists/SortedList";
import { useState } from "react";
import './GamePlaytimeList.css'
import GameCard from "./GameCard";

export default function GamePlaytimeList(props) {
    const game_playtime_sort_options = [
        {value: 'playtime', label: 'Playtime', comparator: (a, b) => b.playtime - a.playtime},
        {value: 'name', label: 'Name', comparator: (a, b) => a.name.localeCompare(b.name)},
        {value: 'lastPlayed', label: 'Last Played', comparator: (a, b) => {
                if (a.lastPlayed === 'Never' || a.lastPlayed === 'Unknown') return 1; // Treat "Never" as the oldest date
                if (b.lastPlayed === 'Never' || b.lastPlayed === 'Unknown') return -1; // Treat "Never" as the oldest date
                return new Date(b.lastPlayed) - new Date(a.lastPlayed)
            }
        }
    ]


    // This tracks the appid of the currently expanded card
    const [expandedId, setExpandedId] = useState(null);
    const [current_sort_option, setCurrentSortOption] = useState(() => {
        const saved = localStorage.getItem('gameListSortMethod')
        return game_playtime_sort_options.find(opt => opt.value === saved) || game_playtime_sort_options[0]
    })
    
    const sortGames = (a, b, sortOrder) => {
        if (sortOrder === 'ascending') {
            return a.playtime - b.playtime
        } else {
            return b.playtime - a.playtime
        }
    }

    const onCardClick = (appid) => {
        // If clicking the already expanded card, close it. Otherwise, open the new one.
        setExpandedId(expandedId === appid ? null : appid);
    }


    const renderGameItem = (game, index) => {
        // Check if this specific card is the one that should be open
        const isExpanded = expandedId === game.appid;

        // Steam's official image server URL
        const imageUrl = `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`;

        let highlighted_stat = current_sort_option.value === 'playtime' ? (
            <><span>{game.playtime}</span> hours</>
            ) : <>Last Played: <span>{game.lastPlayed}</span></>;

        if (current_sort_option.value === 'name') {
            highlighted_stat = <></>; // Don't show a highlighted stat when sorting by name
        }

        return (
            <li key={index} style={{ display: 'contents' }}>
                {/* We add a custom class and onClick event to the Card */}
                <GameCard game={game} isExpanded={isExpanded} onCardClick={onCardClick} imageUrl={imageUrl} highlighted_stat={highlighted_stat} />
            </li>
        )
    }

    const searchControls = (
        <div className="steam-id-search">
            <input 
                type="text" 
                value={props.inputSteamId} 
                onChange={props.onInputChange} 
                placeholder="Enter 64-bit Steam ID"
                className="steam-id-input"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        props.onSearch();
                    }
                }}
            />
            <button onClick={props.onSearch} className="steam-id-btn">Load Profile</button>
        </div>
    );

    // Update localStorage when sort changes
    const handleSortChange = (newOption) => {
        setCurrentSortOption(newOption)
        localStorage.setItem('gameListSortMethod', newOption.value)
    }

    return (
        <SortedList 
            data={props.data} 
            className="game-playtime-list"
            sortOptions={game_playtime_sort_options} 
            currentSortOption={current_sort_option}
            onChangeSortOption={handleSortChange}
            renderItem={renderGameItem}
            extraControls={searchControls}
        />
    )
}