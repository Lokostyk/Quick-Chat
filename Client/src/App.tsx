import {Routes,Route} from "react-router-dom"

import Main from "./Components/Main/Main";
import Login from "./Components/Login/Login"
import Register from "./Components/Register/Register"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
    </Routes>
  );
}

export default App;
