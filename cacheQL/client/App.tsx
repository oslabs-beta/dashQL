import { React, useState } from "react";
import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./components/Home";
import Nav from "./components/Nav";
import Demo from "./components/Demo";


function App() {
  

  return (
    <>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="demo" element={<Demo />} />
          {/* <Route path="/docs" element={<Docs />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
