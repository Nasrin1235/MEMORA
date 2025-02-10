import "../styles/HomePage.css"
import { Link } from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = () => {
  return (
    <div className="container">
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
  );
};

export default HomePage;
