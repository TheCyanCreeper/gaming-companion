import SortOrderButton from './SortOrderButton'
import Panel from '../ui/Panel'
import { useState, useEffect } from 'react'
import SortMethodSelect from "./SortMethodSelect"
import './SortedList.css'

export default function SortedList(props) {
    const class_name = props.className ? `sorted-list ${props.className}` : 'sorted-list'

    const [sort_order, setSortOrder] = useState('descending')

    // 1. Use useEffect to safely set the default option when the data arrives
    useEffect(() => {
        if (!props.currentSortOption && props.sortOptions && props.sortOptions.length > 0) {
            setSortOption(props.sortOptions[0])
        }
    }, [props.sortOptions, props.currentSortOption])

    // 2. Early return: Stop rendering the rest of the component until sort_option is ready
    if (!props.sortOptions || !props.currentSortOption) {
        return <Panel className={class_name}>Loading...</Panel>
    }

    // 3. The rest of the code is now completely safe from null errors!
    const onChangeSortOrder = () => {
        setSortOrder(sort_order === 'ascending' ? 'descending' : 'ascending')
    }

    const sortData = (a,b) => {
        return sort_order === 'descending' ? props.currentSortOption.comparator(a, b) : props.currentSortOption.comparator(b, a)
    }

    const sorted_data = props.data ? [...props.data].sort(sortData) : []

    const onChangeSortMethod = (event) => {
        const new_sort_option = props.sortOptions.find(option => option.value === event.target.value)
        props.onChangeSortOption(new_sort_option)
    }

    return (
    <Panel className={class_name}>
        <div className="sorted-list-controls">
            <SortMethodSelect value={props.currentSortOption.value} onChange={onChangeSortMethod} options={props.sortOptions.map(option => ({value: option.value, label: option.label}))} />
            <SortOrderButton onClick={onChangeSortOrder} sortOrder={sort_order} />
        </div>
        <ul>
            {sorted_data.map((item, index) => props.renderItem(item, index))}
        </ul>
    </Panel>
    )
}