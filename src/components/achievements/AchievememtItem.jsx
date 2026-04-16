
import Panel from '../ui/Panel';
import './AchievementItem.css'

export default function AchievementItem(props) {
    return (
        <Panel className="achievement-item">
            <img className="achievement-icon" src={props.icon} alt={`${props.name} icon`} />
            
            <div className="achievement-details">
                <h3>{props.name}</h3>
                <p>{props.description}</p>
            </div>
        </Panel>
    );
}