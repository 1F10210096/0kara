import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./Home";
import PageA from "./Login";
import Register from "./subsc";
import Menu1 from "./Menu";
import RandomMatch from "./randomMatch";
import Dm from "./dm";
import Friend from "./friend.js";
import Tutorial from "./tutorial/src/Tutorial";
import P2p from "./p2p-room/src/main";
import Dmg from "./Dmg";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/page_a" element={<PageA />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/Menu" element={<Menu1/>} />
        <Route path="/randomMatch" element={<RandomMatch/>} />
        <Route path="/dm" element={<Dm/>} />
        <Route path="/friend" element={<Friend/>} />
        <Route path="/p2p-room" element={<P2p/>} />
        <Route path="*" element={<Navigate to="/" />} />

        <Route path="/tutorial"element={<Tutorial/>} />
        <Route path="/Dmg"element={<Dmg/>} />
    
      </Routes>
    </BrowserRouter>
  );
}

export default App;