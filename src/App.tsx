import React, { useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { getLoggedUser, loginWithGoogle, logout } from "./google/auth";
import { getIdToken, GoogleAuthProvider, User } from "firebase/auth";

function App(): JSX.Element {
    const [user, setUser] = useState<User | null>();
    const [token, setToken] = useState<string>();
    const [needLogin, setNeedLogin] = useState(false);
    const inited = useRef(false);
    const updateUser = () => {
        getLoggedUser().then((user) => {
            setUser(user);
        });
    };
    useEffect(() => {
        if (inited.current) {
            return;
        }
        inited.current = true;
        updateUser();
    }, []);

    useEffect(() => {
        setNeedLogin(user === null);
    }, [user]);
    const handleLogin = () => {
        loginWithGoogle().then((user) => {
            if (user) {
                setUser(user);
            }
        });
    };
    const handleLogout = async () => {
        await logout();
        updateUser();
    };
    return (
        <>
            {needLogin && <button onClick={handleLogin}>Login</button>}
            {user && (
                <div>
                    <img referrerPolicy="no-referrer" src={user.photoURL as string} />
                    <p>User name: {user.displayName}</p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
        </>
    );
}

export default App;
