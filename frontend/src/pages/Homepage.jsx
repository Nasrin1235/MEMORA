import "../styles/HomePage.css"
import { Link } from "react-router-dom";
import "../styles/HomePage.css";


const HomePage = () => {
  return (
    <div className="homepage">
   
      <div className="homePage-header">
        <div className="homePage-titel">
          <h1 className="h1-slogan">MEMORA</h1>
          <h2 className="slogan">Momente kommen und gehen, Erinnerungen bleiben.</h2>
          <div className="homePage-buttons">
            <Link to="/login">
              <button className="btn homePage-login">Login</button>
            </Link>
            <Link to="/register">
              <button className="btn homePage-register">Register</button>
            </Link>
          </div>
        </div>
      </div>

      <div className="homePage-video-section">
        <video autoPlay muted loop className="homePage-video-half">
          <source src="video-homepage.mp4" type="video/mp4" />
          Ihr Browser unterstützt kein Video-Tag.
        </video>
        <div className="video-text-container">
          <h2 className="video-title">lorem </h2>
          <p className="video-text">
           loerfdfghhj kjhlkjhjhkjhkjkk
          </p>
          <Link to="/hana-bar-stool" className="explore-link">Explore all variants</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

