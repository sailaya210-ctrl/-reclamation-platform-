import { BrowserRouter, Routes, Route } from "react-router-dom";
import Accueil from "./Accueil";
import Fonctionnalites from "./Fonctionnalites";
import APropos from "./APropos";
import Login from "./Login";
import Dashboard from "./Dashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import Responsable from "./Responsable";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                element={<Accueil />} />
        <Route path="/fonctionnalites" element={<Fonctionnalites />} />
        <Route path="/a-propos"        element={<APropos />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/dashboard"       element={<Dashboard />} />
        <Route path="/employee"        element={<EmployeeDashboard />} />
       <Route path="/responsable" element={<Responsable />} />
      </Routes>
    </BrowserRouter>
  );
}