import React,{useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import './loginform.css'
import {userOuth} from '../../../userAuth'
import axios from 'axios';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

const Login = () => {

    const {login,ispermitted}=userOuth();


  const navigate=useNavigate();


const [uservalue,setuser]=useState({
  username:'',
  password:''

})

const [error,seterror]=useState(false)

const handlechange=(e)=>{
setuser({
  ...uservalue,
  [e.target.name]:e.target.value

})
}


const onsubmitform=async(e)=>{
  e.preventDefault();

  if(uservalue.username==="moha" && uservalue.password==="123"){
    login(); 
    localStorage.setItem("email",uservalue.username)
  
    navigate("/dashboard");
    seterror(true);
  }


 
 

}

 
 

 return(
  <div className='registration-container'>
    <form onSubmit={onsubmitform}>
      <label>Username</label><br/>
      <input 
      type="text"
      className='form-control'
       name="username"
       value={uservalue.username}
       onChange={handlechange}
       /><br/>
      <label>Password</label><br/>
      <input
      onChange={handlechange}
      type="password"
       value={uservalue.password}
       className='form-control'
      name="password"/><br/>
      <input className='submit-button' type="submit" value="Login"/>


      {error && <span style={{width:"100%"}}   className='btn  btn-warning btn-block mt-4'>Incorrect Username {uservalue.username} or password {uservalue.password}</span>}

    </form>
  </div>
 )
}

export default Login