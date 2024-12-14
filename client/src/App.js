import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import PhoneVerification from "./components/PhoneVerification";
import Home from "./components/Home";
import Dialogs from "./components/Dialogs";
import Messages from "./components/Messages";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/connect_tg" element={<PhoneVerification />} />
          <Route path="/dialogs" element={<Dialogs />} />
          <Route path="/dialogs/:id" element={<Messages />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
