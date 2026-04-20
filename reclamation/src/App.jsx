import { BrowserRouter, Routes, Route } from "react-router-dom";
import Accueil from "./Accueil";
import Login from "./Login";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}