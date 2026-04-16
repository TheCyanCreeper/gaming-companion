export default function AchievementItem(props) {
    return <div className="achievement-item">
        <h3>{props.name}</h3>
        <p>{props.description}</p>
    </div>
}