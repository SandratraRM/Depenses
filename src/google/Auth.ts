import { ThunkDispatch } from "@reduxjs/toolkit";
import { Dispatch } from "react";
import { AnyAction } from "redux";
import { setUser, UserState } from "../appbar/UserSlice";
import { getCodeClient, getTokenClient } from "./GoogleAuth";
import conf from "./Conf";
export interface StoredUser {
    accessToken: string;
    expires: number;
    refreshToken: string;
    name: string | undefined;
    picture: string | undefined;
}
export async function loginWithGoogle(dispatch: Dispatch<AnyAction>) {
    // const tokenClient = getTokenClient();
    // const requestAccessToken = new Promise<google.accounts.oauth2.TokenResponse>((resolve, reject) => {
    //     (tokenClient as any).callback = async (resp: google.accounts.oauth2.TokenResponse) => {
    //         if (resp.error) {
    //             reject(resp.error);
    //         }
    //         resolve(resp);
    //     };
    //     tokenClient.requestAccessToken({
    //         prompt: "consent",
    //     });
    // });
    // const tokenResponse: google.accounts.oauth2.TokenResponse = await requestAccessToken;
    const codeClient = getCodeClient();
    (codeClient as any).callback = (resp: any) => {
        var urlencoded = new URLSearchParams();
        urlencoded.append("client_id", conf.client_id);
        urlencoded.append("client_secret", conf.client_secret);
        urlencoded.append("grant_type", "authorization_code");
        urlencoded.append("code", resp.code);
        urlencoded.append("redirect_uri", "http://localhost:3000");

        var requestOptions = {
            method: "POST",
            body: urlencoded,
        };

        fetch("https://oauth2.googleapis.com/token", requestOptions)
            .then((response) => response.text())
            .then(async (result) => {
                const token = JSON.parse(result);
                gapi.client.setToken({ access_token: token.access_token });
                const userInfo = (await gapi.client.oauth2.userinfo.get()).result;

                const storedToken = {
                    accessToken: token.access_token,
                    expires: new Date().getTime() + token.expires_in * 1000,
                    refreshToken: token.refresh_token,
                    name: userInfo.name,
                    picture: userInfo.picture,
                };
                localStorage.setItem("token", JSON.stringify(storedToken));
                getLoggedUser().then((user) => {
                    dispatch(setUser(user));
                });
            })
            .catch((error) => console.log("error", error));
    };
    codeClient.requestCode();
    // const user = await getLoggedUser();
    // dispatch(setUser(user));
}
function getStoredToken() {
    const rawToken = localStorage.getItem("token");
    if (!rawToken) {
        return null;
    }
    const token: StoredUser = JSON.parse(rawToken);
    return token;
}
async function updateToken(refreshToken: string) {
    var urlencoded = new URLSearchParams();
    urlencoded.append("client_id", conf.client_id);
    urlencoded.append("client_secret", conf.client_secret);
    urlencoded.append("grant_type", "refresh_token");
    urlencoded.append("refresh_token", refreshToken);

    var requestOptions = {
        method: "POST",
        body: urlencoded,
    };

    const response = await fetch("https://oauth2.googleapis.com/token", requestOptions);
    const result = await response.text();
    const token = JSON.parse(result);

    gapi.client.setToken({ access_token: token.access_token });
    const userInfo = (await gapi.client.oauth2.userinfo.get()).result;
    const storedToken = {
        accessToken: token.access_token,
        expires: new Date().getTime() + token.expires_in * 1000,
        refreshToken: refreshToken,
        name: userInfo.name,
        picture: userInfo.picture,
    };
    localStorage.setItem("token", JSON.stringify(storedToken));
}
export async function getLoggedUser() {
    try {
        let storedUser: StoredUser | null = getStoredToken();
        if (storedUser === null) {
            return null;
        }
        if (storedUser.expires < new Date().getTime() + 1000 * 60 * 5) {
            await updateToken(storedUser.refreshToken);
        }
        storedUser = getStoredToken();
        if (!storedUser) {
            return null;
        }
        gapi.client.setToken({ access_token: storedUser.accessToken });
        return {
            displayName: storedUser.name,
            photoURL: storedUser.picture,
        };
    } catch (e) {
        console.log(e);
        return null;
    }
}
export async function logout(dispatch: Dispatch<AnyAction>) {
    localStorage.removeItem("token");
    dispatch(setUser(null));
}
