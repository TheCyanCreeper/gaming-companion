import './SortOrderButton.css'

export default function SortOrderButton(props) {
    return (
        <button className="sort-order-button" onClick={props.onClick}>{props.sortOrder === 'ascending' ? 'Ascending ↑' : 'Descending ↓'}</button>
    )
}