import SortedList from "../lists/SortedList";
import './GamePlaytimeList.css'

export default function GamePlaytimeList(props) {
    return <SortedList data={props.data} className="game-playtime-list" />
}