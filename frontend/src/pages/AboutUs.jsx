
import "../styles/AboutUs.css";

const AboutUs = () => {
  return (
    <div className="container">
      <h1 className="title">Über uns</h1>
      
      <section className="section">
        <h2 className="subtitle">Unsere Mission</h2>
        <p className="text">
          Wir streben danach, eine benutzerfreundliche und sichere Plattform zu schaffen, auf der Nutzer ihre Erinnerungen teilen, Bilder hochladen und wichtige Momente ihres Lebens bewahren können.
        </p>
      </section>
      
      <section className="section team-section">
        <h2 className="subtitle">Unser Team</h2>
        <div className="team-container">
          <div className="team-member">
            <img src="/olha.png" alt="Nasrin" className="team-photo" />
            <p className="team-name">NASRIN</p>
          </div>
          <div className="team-member">
            <img src="/olha.png" alt="Olha" className="team-photo" />
            <p className="team-name">OLHA</p>
          </div>
        </div>
        <p className="text">
          Dieses Projekt wurde von einem Team aus zwei Personen entwickelt, die gemeinsam an der Umsetzung aller Funktionen gearbeitet haben. Wir haben Aufgaben aufgeteilt, Code geschrieben, das System getestet und die Benutzerfreundlichkeit optimiert.
        </p>
      </section>
      
      <section className="section">
        <h2 className="subtitle">Unsere Funktionen</h2>
        <ul className="list">
          <li>Registrierung und Authentifizierung</li>
          <li>Bild-Upload</li>
          <li>Erstellung von Erinnerungen</li>
          <li>Bearbeiten und Löschen</li>
          <li>Suche nach Erinnerungen</li>
        </ul>
      </section>
      
      <section className="section">
        <h2 className="subtitle">Sicherheit</h2>
        <p className="text">
          Wir legen großen Wert auf die Sicherheit der Nutzer und ihrer Daten, indem wir moderne Technologien wie Passwortverschlüsselung und Token-basierte Authentifizierung einsetzen.
        </p>
      </section>
      
      <section>
        <h2 className="subtitle">Kontaktieren Sie uns</h2>
        <p className="text">
          Wenn Sie Fragen oder Vorschläge haben, kontaktieren Sie uns per E-Mail oder über soziale Netzwerke. Wir freuen uns immer über Ihr Feedback!
        </p>
      </section>
    </div>
  );
};

export default AboutUs;

