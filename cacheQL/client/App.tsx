import { React, useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Nav from "./components/Nav";
import Demo from "./components/Demo";
import Docs from "./components/Docs";

// interface dataFormProps{
//   changePage: ()=>void
// }

function App() {
  const [currentPage, setPage] = useState("Home");
  console.log("current page is", currentPage);

  function changePage(page: string): void {
    setPage(page);
  }

  return (
    <>
      {currentPage && <Nav currentPage={currentPage} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="demo" element={<Demo changePage={changePage} />} />
        <Route path="/docs" element={<Docs changePage={changePage} />} />
      </Routes>
    </>
  );
}

export default App;
