import {Routes,Route} from "react-router-dom"

import FrontPage from "./Components/FrontPage/FrontPage";
import Login from "./Components/Login/Login"
import MainHub from "./Components/MainHub/MainHub";
import Register from "./Components/Register/Register"

function App() {
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
