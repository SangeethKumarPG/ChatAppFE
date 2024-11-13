import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { BASE_URL } from "../services/baseUrl";
import { Button, List, ListItem, Menu, TextField } from "@mui/material";
import { MenuItem } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function Home() {
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(
    sessionStorage.getItem("userId")
  );
  const [user, setUser] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [targetUser, setTargetUser] = useState(null);
  const socketRef = useRef(null);
  useEffect(() => {
    if (token) {
      socketRef.current = io(BASE_URL, {
        query: { token },
        transports: ["websocket"],
      });
      socketRef.current.emit("authenticate", { token });
      socketRef.current.on("activeUsers", (users) => {
        setActiveUsers(users);
      });
      socketRef.current.on("messages", (allMessages) => {
        setMessages(allMessages);
      });
      socketRef.current.on("newMessage", (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [token]);
  console.log("Active users: ", activeUsers);
  console.log("Current user :", currentUser);
  const startChat = (user) => {
    console.log("Starting chat with: ", user);
    setTargetUser(user);
    socketRef.current.emit("startChat", user._id);
  };

  const handleSendMessage = () => {
    if (message && targetUser) {
      socketRef.current.emit("sendMessage", {
        receiverId: targetUser._id,
        message: message,
      });
      setMessage("");
    }
  };
  console.log("Messages: ", messages);
  return (
    <>
      <div className="d-flex p-0 m-0">
        <div
          className="d-flex flex-column"
          style={{ backgroundColor: "gray", height: "100vh", width: "20vw" }}
        >
          <h4 className="mt-2 mb-1 text-center">Active Users</h4>
          <List>
            {activeUsers?.map((user, index) => (
              <ListItem
                key={index}
                onClick={() => startChat(user)}
                style={{
                  cursor: "pointer",
                  color: "white",
                  display: currentUser === user._id ? "none" : "block",
                }}
              >
                {user.username}
              </ListItem>
            ))}
          </List>
        </div>
        <div
          className="d-flex flex-column"
          style={{
            backgroundColor: "whitesmoke",
            height: "100vh",
            width: "100vw",
          }}
        >
          {targetUser ? (
            <div className="flex-grow-1 d-flex flex-column p-3">
              <h5 className="ms-2">{targetUser.username}</h5>
              {messages?.length === 0 ? (
                <div
                  className="d-flex flex-column justify-content-center align-items-center"
                  style={{ flexGrow: 1 }}
                >
                  <p>Start a conversation</p>
                </div>
              ) : (
                <div className="flex-grow-1 d-flex flex-column overflow-auto">
                  {messages.map((message, index) => (
                    <div key={index} className="mb-2">
                      {targetUser._id === message.sender ? (
                        <div
                          className="d-flex justify-content-start p-3"
                          style={{
                            backgroundColor: "green",
                            borderRadius: "10px",
                            color: "white",
                            maxWidth: "100%",
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <AccountCircleIcon style={{ marginRight: "8px" }} />
                            <div>
                              <div>{targetUser.username}</div>
                              <div>{message.message}</div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="d-flex justify-content-end p-3"
                          style={{
                            backgroundColor: "blue",
                            borderRadius: "10px",
                            color: "white",
                            maxWidth: "100%",
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <div>
                              <div>Me</div>
                              <div>{message.message}</div>
                            </div>
                            <AccountCircleIcon style={{ marginLeft: "8px" }} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="d-flex">
                <div style={{ width: "90%" }}>
                  <TextField
                    variant="standard"
                    fullWidth
                    label="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <div style={{ width: "10%" }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      height: "100%",
                    }}
                    startIcon={<SendIcon />}
                    onClick={handleSendMessage}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ flexGrow: 1 }}
            >
              <p>Please select a user to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
