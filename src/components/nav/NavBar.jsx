import './NavBar.css'

const NavBar = ({ onSelectTab, tabs }) => {

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1 className="navbar-title">Steam Companion</h1>
        <ul>
            {tabs.map((tab, index) => (
                <li key={tab.name} className="nav-tab" onClick={() => onSelectTab(index)}>{tab.name}</li>
            ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;