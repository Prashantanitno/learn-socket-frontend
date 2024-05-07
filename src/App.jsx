import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");

  const socket = useMemo(
    () =>
      io("http://localhost:3000", {
        withCredentials: true,
      }),
    [],
  );

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected ----> ", socket.id);
    });

    socket.on("recieve-msg", (data) => {
      console.log("recieve msg -> ", data);
      setMessages((messages) => [...messages, data]);
    });

    socket.on("welcome", (data) => {
      console.log(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h6" component="div" gutterBottom>
        Welcome to the room {socketID}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <h4>Join Room</h4>
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="outlined-basic"
          label="Room Name"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Join
        </Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic"
          label="Message"
          variant="outlined"
        />
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          label="Room"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>
      <Stack></Stack>
      {messages.map((m, i) => (
        <Typography key={i} variant="h6" component="div" gutterBottom>
          {m.message}
        </Typography>
      ))}
    </Container>
  );
};

export default App;
