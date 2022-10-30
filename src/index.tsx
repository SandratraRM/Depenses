import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import scriptJs from "scriptjs";
import initGapi from "./google/Gapi";
import { initCodeClient, initTokenClient } from "./google/GoogleAuth";


const loadScripts = function () {
    return new Promise<void>((resolve, reject) => {
        scriptJs("https://accounts.google.com/gsi/client", () => {
            scriptJs("https://apis.google.com/js/api.js", () => {
                resolve();
            })
        });
    });
};

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
loadScripts().then(async () => {
    // initTokenClient();
    initCodeClient();
    await initGapi();
    root.render(
        <React.StrictMode>
            <Provider store={store}>
                <App />
            </Provider>
        </React.StrictMode>
    );
});
