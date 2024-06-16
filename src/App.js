import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Componets/Navbar";
import Home from "./Componets/Home";
import About from "./Componets/About";
import NoteState from "./context/notes/NoteState";
import Alert from "./Componets/Alert";
import Login from "./Componets/Login";
import Signup from "./Componets/Signup";

function App() {
  return (
    <>
      <NoteState>
        <Router>
          <Navbar />
          <Alert message = "This is amazing react course"/>
          <div className="container">
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/about" element={<About />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/signup" element={<Signup />} />
            </Routes>
          </div>
        </Router>
      </NoteState>
    </>
  );
}

export default App;
