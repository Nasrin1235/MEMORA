import {  Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import  Sidebar from "./components/Sidebar.jsx"

function App() {
  return (

   
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Sidebar />} />
      </Routes>
   

  )
}

export default App
