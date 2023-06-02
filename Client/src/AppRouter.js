import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Login from "./components/Login/Login.js";
import Register from "./components/Register/Register.js";
import Home from "./components/Home/Home.js";

const AppRouter = () => {
  return (
      <BrowserRouter basename={process.env.PUBLIC_URL}>
          <Routes>
                <Route path='/*' element={<Home />}/>
                <Route path='/register' element={<Register />}/>
                <Route path='/login' element={<Login />}/>
            </Routes>
      </BrowserRouter>
  );
};

export default AppRouter;
