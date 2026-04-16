import Panel from '../ui/Panel';
import './NavBar.css'
import { Link, NavLink } from 'react-router-dom';

const NavBar = ({ onSelectTab, tabs }) => {

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1 className="navbar-title">Steam Companion</h1>
        <Panel className="nav-tabs">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Inventory</NavLink>
            <NavLink to="/achievements" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Achievements</NavLink>
            {/* <NavLink to="/friends" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Friends</NavLink> */}
            <NavLink to="/game-randomizer" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Game Randomizer</NavLink>
        </Panel>
      </div>
    </nav>
  );
};

export default NavBar;