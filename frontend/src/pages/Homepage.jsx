import "../styles/HomePage.css"
import { Link } from "react-router-dom";
import ScrollingInfoBlock from "../components/ScrollingInfoBlock";

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
              <button className="btn-homePage homePage-login">Login</button>
            </Link>
            <Link to="/register">
              <button className="btn-homePage homePage-register">Register</button>
            </Link>
          </div>
        </div>
      </div>
      <ScrollingInfoBlock />
      <div className="homePage-video-section">
        <div className="video-text-container">
          <h2 className="video-title">lorem </h2>
          <p className="video-text">
           loerfdfghhj kjhlkjhjhkjhkjkk
          </p>
        </div>
        <video autoPlay muted loop className="homePage-video-half">
          <source src="video-homepage.mp4" type="video/mp4" />
          Ihr Browser unterstützt kein Video-Tag.
        </video>
      </div>
      
    </div>
  );
};

export default HomePage;

