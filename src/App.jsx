

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import BadgeTemplates from "./pages/BadgeTemplates";
import BadgeEditor from "./pages/BadgeEditor";
import CsvUploadPage from "./pages/CsvUploadPage";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/badges" element={<BadgeTemplates />} />
        <Route path="/badge-editor/:orgId" element={<BadgeEditor />} />
        <Route path="/csv-upload" element={<CsvUploadPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
 