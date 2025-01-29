import Sidebar from "../components/Sidebar";
import MemoryList from "../components/MemoryList"
import "../styles/MainPage.css";

const MainPage = () => {
  return (
    <div className="main-page">
      <Sidebar />
      <div className="content">
      <MemoryList />
      </div>
    </div>
  );
};

export default MainPage;
