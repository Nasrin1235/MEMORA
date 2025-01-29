import {  Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import MainPage from "./pages/MainPage"
import HomePage from "./pages/Homepage"

function App() {
  return (

      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/main" element={<MainPage/>} />
      </Routes>
  )
}

export default App
