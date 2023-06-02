import './App.css';
import Header from './Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from "js-cookie";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import {useState} from "react";
import { CSSTransition } from 'react-transition-group';
import AppRouter from "./AppRouter";



function App() {
  const [showRegister, setShowRegister] = useState(false);

  const handleShowRegister = () => {
    setShowRegister(true);
  };

  const handleShowLogin = () => {
    setShowRegister(false);
  };

  if (!Cookies.get('token')) {
    return (
      <div>
        {showRegister ? (
          <CSSTransition in={showRegister} classNames="fade" timeout={300}>
            <Register showLogin={handleShowLogin} />
          </CSSTransition>
        ) : (
           <CSSTransition
            in={!showRegister}
            timeout={300}
            classNames="login-box"
            unmountOnExit
          >
            <Login showRegister={handleShowRegister} />
          </CSSTransition>
        )}
      </div>
    );
  } else {
    return (
      <div>
        <Header />
        <AppRouter />
      </div>
    );
  }
}

export default App;




