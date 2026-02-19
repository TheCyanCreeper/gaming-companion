import './Card.css'
import Panel from './Panel'

export default function Card(props) {
    const class_name = props.className ? `card ${props.className}` : 'card'
    return (
        <Panel className={class_name}>
            {props.children}
        </Panel>
    )
}