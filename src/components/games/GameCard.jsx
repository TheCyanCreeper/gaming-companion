import React, { useState } from 'react';
import Card from "../ui/Card";
import './GameCard.css'
export default function GameCard({ game, isExpanded, onCardClick, imageUrl, highlighted_stat }) {
    return <Card className={`game-card ${isExpanded ? 'expanded' : ''}`}>
                    
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
}