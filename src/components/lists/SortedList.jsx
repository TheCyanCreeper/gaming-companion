import Card from "../ui/Card"
import SortOrderButton from './SortOrderButton'
import { useState } from 'react'

export default function SortedList(props) {
    const class_name = props.className ? `sorted-list ${props.className}` : 'sorted-list'

    const [sort_order, setSortOrder] = useState('descending')

    const onChangeSortOrder = () => {
        setSortOrder(sort_order === 'ascending' ? 'descending' : 'ascending')
    }

    const sorted_data = props.data ? [...props.data].sort((a, b) => {
        if (sort_order === 'ascending') {
            return a.playtime - b.playtime
        } else {
            return b.playtime - a.playtime
        }
    }) : []

    return (
    <Card className={class_name}>
        <SortOrderButton onClick={onChangeSortOrder} sortOrder={sort_order} />
        <ul>
            {sorted_data.map((game, index) => (
            <Card key={index}>{game.name}: {game.playtime} hours</Card>
            ))}
        </ul>
    </Card>
    )
}