import { useParams, useNavigate } from "react-router-dom";
import MemoryDetail from "../components/MemoryDetail";
import Sidebar from "../components/Sidebar";
import "../styles/MemoryDetailPage.css";

const MemoryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="memory-detail-page">
        <Sidebar />
      <MemoryDetail memoryId={id} onClose={() => navigate("/main")} />
    </div>
  );
};

export default MemoryDetailPage;