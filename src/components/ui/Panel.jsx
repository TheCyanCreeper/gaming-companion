import './Panel.css'

export default function Panel(props) {
    const class_name = props.className ? `panel ${props.className}` : 'panel'
    return (
        <div className={class_name}>
            {props.children}
        </div>
    )
}