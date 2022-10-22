import React, { useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { getLoggedUser, loginWithGoogle, logout } from "./google/auth";
import { User } from "firebase/auth";
import AppBar from "./appbar/Appbar";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { setUser } from "./appbar/UserSlice";
import { Button, Container, Typography } from "@mui/material";

function App(): JSX.Element {
    const user = useAppSelector((state) => state.user.current);
    const dispatch = useAppDispatch();
    const handleSetUser = (user: User | null) => {
        dispatch(setUser(user));
    };
    const handleLogin = () => {
        loginWithGoogle().then((user) => {
            handleSetUser(user);
        });
    };
    const login = user === null && (
        <Container
            sx={{
                textAlign: "center",
                p: 2,
            }}
        >
            <Typography
                variant="h5"
                sx={{
                    m: 2,
                }}
            >
                Start by log in with Google
            </Typography>
            <Button variant="contained" onClick={handleLogin}>
                Login
            </Button>
        </Container>
    );

    return (
        <>
            <AppBar />
            {login}
        </>
    );
}

export default App;
