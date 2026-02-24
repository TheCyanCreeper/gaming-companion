import Panel from '../ui/Panel';
import './NavBar.css'

const NavBar = ({ onSelectTab, tabs }) => {

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1 className="navbar-title">Steam Companion</h1>
        <Panel className="nav-tabs">
            <ul>
                {tabs.map((tab, index) => (
                    <li key={tab.name} className="nav-tab" onClick={() => onSelectTab(index)}>{tab.name}</li>
                ))}
            </ul>
        </Panel>
      </div>
    </nav>
  );
};

export default NavBar;