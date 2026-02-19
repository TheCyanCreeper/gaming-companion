import Card from "../ui/Card";
import SortedList from "../lists/SortedList";
import { useState } from "react";
import './GamePlaytimeList.css'

export default function GamePlaytimeList(props) {
    const game_playtime_sort_options = [
        {value: 'playtime', label: 'Playtime', comparator: (a, b) => b.playtime - a.playtime},
        {value: 'name', label: 'Name', comparator: (a, b) => a.name.localeCompare(b.name)},
        {value: 'lastPlayed', label: 'Last Played', comparator: (a, b) => {
                if (a.lastPlayed === 'Never') return 1; // Treat "Never" as the oldest date
                if (b.lastPlayed === 'Never') return -1; // Treat "Never" as the oldest date
                return new Date(b.lastPlayed) - new Date(a.lastPlayed)
            }
        }
    ]


    // This tracks the appid of the currently expanded card
    const [expandedId, setExpandedId] = useState(null);
    const [current_sort_option, setCurrentSortOption] = useState(game_playtime_sort_options[0])
    
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
                <Card className={`game-card ${isExpanded ? 'expanded' : ''}`}>
                    
                    <div className="card-clickable-area" onClick={() => onCardClick(game.appid)}>
                        {/* The Game Banner Image */}
                        <img 
                            src={imageUrl} 
                            alt={`${game.name} banner`} 
                            className="game-banner"
                            // Fallback just in case a game doesn't have a banner
                            onError={(e) => e.target.style.display = 'none'} 
                        />
                        
                        <div className="game-title">{game.name}</div>
                        <div className="highlighted-stat">{highlighted_stat}</div>
                    </div>

                    {/* The Hidden Details Section */}
                    {isExpanded && (
                        <div className="game-details-expanded">
                            <hr />
                            <p><strong>Last Played:</strong> {game.lastPlayed}</p>
                            <p><strong>Total Playtime:</strong> {game.playtime} Hours</p>
                            
                            {/* Only show OS stats if they actually played on that OS */}
                            {game.playtimeWindows > 0 && <p><strong>Windows:</strong> {game.playtimeWindows} Hours</p>}
                            {game.playtimeMac > 0 && <p><strong>Mac:</strong> {game.playtimeMac} Hours</p>}
                            {game.playtimeLinux > 0 && <p><strong>Linux:</strong> {game.playtimeLinux} Hours</p>}
                            
                            <button 
                                className="play-button" 
                                onClick={(e) => {
                                    e.stopPropagation(); // Stops the card from closing when you click the button
                                    window.open(`https://store.steampowered.com/app/${game.appid}`, '_blank');
                                }}
                            >
                                View on Steam Store
                            </button>
                        </div>
                    )}
                </Card>
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



    return (
        <SortedList 
            data={props.data} 
            className="game-playtime-list"
            sortOptions={game_playtime_sort_options} 
            currentSortOption={current_sort_option}
            onChangeSortOption={setCurrentSortOption}
            renderItem={renderGameItem}
            extraControls={searchControls}
        />
    )
}