// import '../styles/Sidebar.css';

// const Sidebar = () => {
//   return (
//     <div className="sidebar">
//       <h2 className="logo">Journal</h2>
//       <nav className="menu">
//         <ul>
//           <li>Timeline</li>
//           <li>Calendar</li>
//           <li>Media</li>
//         </ul>
//       </nav>
//       <div className="user-info">
//         <img src="/default-avatar.png" alt="User" className="user-avatar" />

//         <p>John Appleseed</p>
//       </div>

//       <button className="add-story-btn">Add Story</button>
//     </div>
//   );
// };

// export default Sidebar;
import "../styles/Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="search-box">
          <input type="text" placeholder="Search" className="search-input" />
        </div>
        <h2 className="logo">Journal</h2>
      </div>

      <nav className="menu">
        <ul>
          <li>📅 Calendar</li>
          <li>📷 Media</li>
          <li>🗺️ Atlas</li>
          <li>🏖️ Wetter</li>
          <li>⭐Favorites</li>
        </ul>
      </nav>

      
      <div className="story-section">
        <button className="add-story-btn">Add Story</button>
      </div>
      <div className="user-info">
        <img src="/default-avatar.png" alt="User" className="user-avatar" />
        <p>John Appleseed</p>
      </div>
    </div>
  );
};

export default Sidebar;
