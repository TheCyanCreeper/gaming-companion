import './Card.css'

export default function Card(props) {
    const class_name = props.className ? `card ${props.className}` : 'card'
    return (
        <div className={class_name}>
            {props.children}
        </div>
    )
}