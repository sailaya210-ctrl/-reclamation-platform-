import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Accueil from "./Accueil";
import Fonctionnalites from "./Fonctionnalites";
import APropos from "./APropos";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Responsable from "./Responsable";
import EmployeeDashboard from "./EmployeeDashboard";
import IntervenantDashboard from "./IntervenantDashboard";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Publiques */}
          <Route path="/"                element={<Accueil />} />
          <Route path="/fonctionnalites" element={<Fonctionnalites />} />
          <Route path="/a-propos"        element={<APropos />} />
          <Route path="/login"           element={<Login />} />

          {/* Protégées */}
          <Route path="/dashboard" element={
            <ProtectedRoute roles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/responsable" element={
            <ProtectedRoute roles={["responsable"]}>
              <Responsable />
            </ProtectedRoute>
          } />

          <Route path="/employee" element={
            <ProtectedRoute roles={["employe"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          } />

          <Route path="/intervenant" element={
            <ProtectedRoute roles={["intervenant"]}>
              <IntervenantDashboard />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}