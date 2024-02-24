import { React, useState } from "react";
import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./components/Home";
import Nav from "./components/Nav";
import Demo from "./components/Demo";
import Docs from "./components/Docs";

// interface dataFormProps{
//   changePage: ()=>void
// }

function App() {

  const [currentPage, setPage] = useState("Home")
  console.log('current page is', currentPage)

  function changePage(page:any):void {
    setPage(page)
  }
  

  return (
    <>
      <BrowserRouter>
        {currentPage && <Nav currentPage={currentPage}/>}
        {/* <Nav currentPage = {currentPage} changePage={changePage}/> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="demo" element={<Demo changePage={changePage}/>} />
          <Route path="/docs" element={<Docs changePage={changePage}/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
