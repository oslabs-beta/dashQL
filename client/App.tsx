import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Nav from "./components/Nav";
import Demo from "./components/Demo";

function App() {
  const [currentPage, setPage] = useState<string>("Home");

  function changePage(page: string): void {
    setPage(page);
  }

  return (
    <>
      <Nav currentPage={currentPage} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="demo" element={<Demo changePage={changePage} />} />
        {/* <Route path="/docs" element={<Docs changePage={changePage} />} /> */}
      </Routes>
    </>
  );
}

export default App;
