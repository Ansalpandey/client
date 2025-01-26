import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Guides from "./pages/Guides";
import Login from "./pages/Login";
import StartBuilding from "./pages/StartBuilding";
import Careers from './pages/Careers';
import Blog from "./pages/Blog";
import Pricing from "./pages/Pricing";
import ContactSales from "./pages/ContactSales";
import Teams from "./pages/Teams";
import Editor from "./pages/Editor";
function App() {
  return (
    <Router>
      <div className="w-full h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<StartBuilding />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact-sales" element={<ContactSales />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/editor" element={<Editor />} />
        </Routes>
      </div>
    </Router>
);
}

export default App
