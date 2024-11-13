import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import LoggInIcon from "@mui/icons-material/Login";
import { toast } from "react-toastify";
import LogoutIcon from '@mui/icons-material/Logout';
import { logoutAPI } from '../services/allApi';

function Header({isLoggedIn, setIsLoggedIn}) {
  

  const navigate = useNavigate();
  const checkUserCredentials = ()=>{
    const userData = sessionStorage.getItem('userData');
    setIsLoggedIn(!!userData);
  }

  const handleLogout = async ()=>{
    if(sessionStorage.getItem('token')){
      setIsLoggedIn(false);
      const headers = {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
      const response = await logoutAPI(headers);
      if(response.status === 200){
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('token');
        toast.success("Logged out successfully", {position:'top-center'});
        navigate('/');
      }else{
        toast.error("Failed to logout", {position:'top-center'});
      }
      

    }else{
      navigate('/');
    }
    
  }
  useEffect(()=>{
    checkUserCredentials();
  },[isLoggedIn])
  return (
    <>
      <Navbar className="bg-light">
        <Container>
          <Link to="/home">
            <Navbar.Brand>
              {/* <img
                alt=""
                src={logo}
                width={"100"}
                height={"60"}
                className="d-inline-block align-top m-0 p-0"
              /> */}

              <p className="d-inline-block align-top mt-3 ms-0 b-0 p-0">
                ChatApp
              </p>
            </Navbar.Brand>
          </Link>
        </Container>
        <Button variant="contained"  color={isLoggedIn?"error":"success"} startIcon={isLoggedIn ? <LogoutIcon />:<LoggInIcon />} onClick={handleLogout} >
        </Button>
      </Navbar>
    </>
  );
}

export default Header;
