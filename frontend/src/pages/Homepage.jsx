import "../styles/HomePage.css"
import { Link } from "react-router-dom";
import "../styles/HomePage.css";


const HomePage = () => {
  return (
    <div className="homepage">
   
      <div className="header">
        <div className="titel">
          <h1 className="h1-slogan">MEMORA</h1>
          <h2 className="slogan">Momente kommen und gehen, Erinnerungen bleiben.</h2>
          <div className="buttons">
            <Link to="/login">
              <button className="btn login">Login</button>
            </Link>
            <Link to="/register">
              <button className="btn register">Register</button>
            </Link>
          </div>
        </div>
      </div>

 
      <div className="info-bar">
        <div className="info-item">
          <img src="vite.svg" alt="Icon 1" />
          <p>Erinnerungen bewahren</p>
        </div>
        <div className="info-item">
          <img src="vite.svg" alt="Icon 2" />
          <p>Gemeinsam teilen</p>
        </div>
        <div className="info-item">
          <img src="vite.svg" alt="Icon 3" />
          <p>Momente genießen</p>
        </div>
        <div className="info-item">
          <img src="vite.svg" alt="Icon 4" />
          <p>Für die Zukunft sichern</p>
        </div>
      </div>

  
      <div className="video-section">
        <video autoPlay muted loop className="video-half">
          <source src="bj.mp4" type="video/mp4" />
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

