import React, { useState } from "react";
import { Card } from "react-bootstrap";
import loginPageImage from "../assets/login-screen-image.png";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { registerAPI, loginAPI } from "../services/allApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister= async ()=>{
    if(username !== "" && password !== ""){
        const response = await registerAPI({username:username, password:password});
        if(response.status === 201){
            toast.success("Registration successful");
            setIsRegister(false);
        }else{
            toast.error("Registration failed");
        }
    }
  }

  const handleLogin = async() => {
    if (username !== "" && password !== "") {
        const response = await loginAPI({ username: username, password: password });
        if (response.status === 200) {
            
            sessionStorage.setItem("token", response.data.token);
            sessionStorage.setItem("userId", response.data.userId);
            toast.success("Login successful");
            navigate("/home");
        } else {
            console.log(response)
            toast.error("Invalid username or password");
        }
    }
  }
  return (
    <>
      <div className="container p-2 mt-5 d-flex align-items-center justify-content-center">
        <div
          className="d-flex flex-column flex-md-row justify-content-center align-items-center rounded shadow"
          style={{ backgroundColor: "orange", color: "white" }}
        >
          <div>
            <Card style={{ width: "20rem" }}>
              <Card.Img variant="top" src={loginPageImage} />
            </Card>
          </div>
          <div style={{ width: "20rem" }} className="d-flex flex-column">
            <div className="mt-3 p-2">
              <TextField id="username" label="Username" fullWidth 
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mt-3 p-2">
              <TextField
                id="password"
                label="Password"
                type="password"
                fullWidth
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {isRegister ? (
              <>
                <div className="mt-3 p-2">
                  <Button variant="contained" color="primary" fullWidth onClick={handleRegister}>
                    Register
                  </Button>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <p>
                    Already registered?{" "}
                    <span
                      onClick={() => setIsRegister(false)}
                      style={{ cursor: "pointer" }}
                     
                    >
                      Login
                    </span>
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="mt-3 p-2">
                  <Button variant="contained" color="primary" fullWidth  onClick={handleLogin}>
                    Login
                  </Button>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <p>
                    Dont have an account?{" "}
                    <span
                      onClick={() => setIsRegister(true)}
                      style={{ cursor: "pointer" }}
                    >
                      Register
                    </span>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
