# MEMORA
ist eine Webanwendung zur Speicherung von Erinnerungen, Ereignissen und besuchten Orten. Dieses Projekt ermöglicht es Benutzern, Erinnerungen mit Bildern zu erstellen, zu bearbeiten und anzuzeigen sowie Lieblingsmomente zu markieren.
---
## :klemmbrett: Hauptfunktionen
- **Benutzerregistrierung und -anmeldung**: Benutzer können sich registrieren, in ihre Konten einloggen und Daten sicher speichern.
- **Erstellung von Erinnerungen**: Möglichkeit, Titel, Beschreibung, Standort und Bilder zu speichern.
- **Verwaltung von Erinnerungen**: Bearbeiten, Löschen und Hinzufügen zu "Favoriten".
- **Unterstützung von Standorten**: Speicherung von Informationen über besuchte Orte.
- **Sicherheit**: Passwort-Hashing und Authentifizierung mit JWT.
---
## :offener_ordner: Projektstruktur
### Backend
- **Technologien:**
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
- **Hauptdateien:**
  - `memorySchema` - Schema zur Speicherung von Erinnerungen mit Feldern wie Titel, Beschreibung, besuchte Orte, Favoriten und Datum.
  - `userSchema` - Schema für Benutzer mit E-Mail-Validierung, Passwort-Hashing und Rollen (Admin/Benutzer).
  - `dbConnection` - Verwaltung der Verbindung zu MongoDB.
- **Installierte Pakete:**
  ```json
  "bcrypt": "^5.1.1",
  "cors": "^2.8.5",
  "express": "^4.21.2",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.9.5",
  "nodemon": "^3.1.9"
  ```
### Frontend
- **Technologien:**
  - React
  - React Router DOM
  - Vite (für den Build-Prozess)
- **Hauptdateien:**
  - Komponenten zur Anzeige und Verwaltung von Erinnerungen.
  - Routing für Seiten wie Anmeldung, Erinnerungsübersicht und Benutzerprofil.
- **Installierte Pakete:**
  ```json
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^7.1.3"
  ```
---
## :rakete: Installation und Start des Projekts
### Voraussetzungen
- Node.js (v16 oder höher)
- MongoDB
- npm oder yarn
### Installationsschritte
1. **Repository klonen:**
   ```bash
   git clone https://github.com/your-repo/memora.git
   ```
2. **Abhängigkeiten für das Backend installieren:**
   ```bash
   cd backend
   npm install
   ```
3. **Abhängigkeiten für das Frontend installieren:**
   ```bash
   cd frontend
   npm install
   ```
4. **Umgebungsvariablen einrichten:**
   Erstellen Sie eine `.env`-Datei im Backend-Ordner und fügen Sie hinzu:
   ```env
   MONGODB_URI=your-mongodb-uri
   JWT_SECRET=your-secret-key
   ```
5. **Backend starten:**
   ```bash
   npm run start
   ```
6. **Frontend starten:**
   ```bash
   npm run dev
   ```
7. **Anwendung im Browser öffnen:**
   ```
   http://localhost:5173
   ```
---
## :bücher: API-Endpunkte
### Benutzer
- `POST /api/users/register` - Registrierung eines neuen Benutzers
- `POST /api/users/login` - Anmeldung eines Benutzers
### Erinnerungen
- `GET /api/memories` - Abrufen aller Erinnerungen
- `POST /api/memories` - Erstellung einer neuen Erinnerung
- `PUT /api/memories/:id` - Aktualisierung einer Erinnerung
- `DELETE /api/memories/:id` - Löschen einer Erinnerung
---
## :hammer_und_schraubenschlüssel: Zukünftige Verbesserungen
- Unterstützung für Multimedia (Videos, Audio).
- Filterung von Erinnerungen nach Datum und Standort.
- Integration von Karten zur Visualisierung besuchter Orte.