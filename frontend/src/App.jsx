import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Home from './pages/Home'
import { userDataContext } from './context/UserContext';
import Customize from './pages/Customize';
import Customize2 from './pages/Customize2';

export default function App() {
  const {userData, setUserData}=useContext(userDataContext)
  return (
      <Routes>
       {/* <Route path='/'  element={userData? <Home/>:<Navigate to={'/customize'} />}/> */}
       <Route path='/'  element={(userData?.assistantImage && userData?.assistantName)? <Home/>:<Navigate to={'/customize'} />}/>
       {/* <Route path='/'  element={<Navigate to={'/customize'} />}/> */}
       <Route path='/signup' element={!userData ?<SignUp/>:<Navigate to={"/"} />}/>
       <Route path='/login' element={!userData ?<Login/>:<Navigate to={"/"} />}/>
       <Route path='/customize' element={userData?<Customize/>:<Navigate to={"/signup"} />}/> 
       <Route path='/customize2' element={userData?<Customize2/>:<Navigate to={"/signup"} />}/> 
    </Routes>
  )
}
