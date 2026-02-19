// src/components/profile/UserProfile.jsx
import './UserProfile.css'

const UserProfile = ({ profile }) => {
  // Steam Persona States: 0 - Offline, 1 - Online, 2 - Busy, 3 - Away, etc.
  // In-game is indicated by the presence of 'gameextrainfo'
  const getStatusColor = () => {
    if (profile.gameextrainfo) return '#90ba3c'; // Green (In-game)
    if (profile.personastate > 0) return '#57cbde'; // Blue (Online)
    return '#898989'; // Grey (Offline)
  };

  let lastLogoff = new Date(profile.lastlogoff * 1000).toLocaleString();
  lastLogoff = lastLogoff === 'Invalid Date' ? 'Unknown' : lastLogoff;

  return (
    <div className="profile-container">
      <div className="avatar-wrapper" style={{ borderColor: getStatusColor() }}>
        <img src={profile.avatarfull} alt={profile.personaname} className="profile-avatar" />
      </div>
      
      <div className="profile-info">
        <div className="profile-header">
          <h2>{profile.personaname}</h2>
          {profile.loccountrycode && (
            <img 
              src={`https://flagsapi.com/${profile.loccountrycode}/flat/32.png`} 
              alt={profile.loccountrycode}
              title={profile.loccountrycode}
            />
          )}
        </div>

        <p className="status-text" style={{ color: getStatusColor() }}>
          {profile.gameextrainfo ? `Playing: ${profile.gameextrainfo}` : 
           profile.personastate > 0 ? 'Online' : 'Offline'}
        </p>
        
        <p className="last-online">Last Online: {lastLogoff}</p>
      </div>
    </div>
  );
};

export default UserProfile;