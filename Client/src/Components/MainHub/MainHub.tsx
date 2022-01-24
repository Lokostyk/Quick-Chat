import "./mainHub.scss"
import LeftBar from "./subcomponents/LeftBar"
import {useAppSelector} from "../../App/hooks"

function MainHub() {
  const state = useAppSelector(state=>state.userSlice)
  
  //Checking if user is logged in
  // if(!state.name){
  //   window.location.pathname = "/"
  // }
  return (
    <section className="mainHubContainer">
      <LeftBar />
      <div></div>
    </section>
  );
}

export default MainHub;
