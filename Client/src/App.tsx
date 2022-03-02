import { useEffect } from "react";
import {Routes,Route, useNavigate} from "react-router-dom"

import FrontPage from "./Components/FrontPage/FrontPage";
import Login from "./Components/Login/Login"
import MainHub from "./Components/MainHub/MainHub";
import Register from "./Components/Register/Register"

function App() {
  const navigate = useNavigate()
  //If user have active token, log in
  useEffect(()=>{
    if(window.localStorage.getItem("authToken")){
      navigate("/logged")
    }
  },[])
  return (
    <Routes>
      <Route path="/" element={<FrontPage />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/logged" element={<MainHub />}/>
    </Routes>
  );
}

export default App;
