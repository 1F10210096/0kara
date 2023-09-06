import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./Home";
import PageA from "./Login";
import Register from "./subsc";
import Menu from "./Menu";
import RandomMatch from "./randomMatch";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/page_a" element={<PageA />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/Menu" element={<Menu/>} />
        <Route path="/randomMatch" element={<RandomMatch/>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;