import { useEffect, useRef } from "react";
import "./App.css";
import { getLoggedUser, loginWithGoogle } from "./google/Auth";
import AppBar from "./appbar/Appbar";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { setUser } from "./appbar/UserSlice";
import { Button, Container, Typography } from "@mui/material";
import { ValueInputOption } from "./google/SheetsTypes";
import moment from "moment";
function App(): JSX.Element {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user.current);
    const handleLogin = () => {
        loginWithGoogle(dispatch);
    };
    const inited = useRef(false);
    useEffect(() => {
        if (inited.current) {
            return;
        }
        inited.current = true;
        getLoggedUser().then((user) => {
            dispatch(setUser(user));
        });
    }, []);
    useEffect(() => {
        if (user) {
            appendValues("1nJg69dKIaJwXDdQDuy46IQHhSGMmvqI563Rf0Gy5GIQ", "Form responses 1", "USER_ENTERED", [
                [moment().format("DD/MM/YYYY HH:mm:SS"), "Test","Espece","Entrée","0",moment().format("DD/MM/YYYY"),"TRUE","TRUE", user.displayName as string],
            ]);
        }
    }, [user]);
    async function appendValues(
        spreadsheetId: string,
        range: string,
        valueInputOption: ValueInputOption,
        values: string[][]
    ) {
        const body = {
            values: values,
        };
        try {
            const response = await window.gapi.client.sheets.spreadsheets.values.append({
                spreadsheetId: spreadsheetId,
                range: range,
                valueInputOption: valueInputOption,
                resource: body,
            });

            return response;
        } catch (err) {
            console.log(err);
        }
        return null;
    }

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
