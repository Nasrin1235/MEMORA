import "../styles/HomePage.css"
import { Link } from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = () => {
  return (
    <div className="container">
      <h1 className="slogan">Momente kommen und gehen, Erinnerungen bleiben.</h1>
      <div className="buttons">
        <Link to="/login">
          <button className="btn login">Login</button>
        </Link>
        <Link to="/register">
          <button className="btn register">Register</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
