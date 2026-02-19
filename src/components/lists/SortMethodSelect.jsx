import './SortMethodSelect.css'
export default function SortMethodSelect(props) {
    return <select className="sort-method" value={props.value} onChange={props.onChange}>
        {props.options.map((option, index) => (
            <option key={index} value={option.value}>{option.label}</option>
        ))}
    </select>
}