import conf from "./Conf";

const SCOPES = "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.profile";
let tokenClient: google.accounts.oauth2.TokenClient;
export function initTokenClient() {
    tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: conf.client_id,
        scope: SCOPES,
        callback: () => {},
    });
    (window as any).tokenClient = tokenClient;
}
export function getTokenClient(): google.accounts.oauth2.TokenClient {
    if (!tokenClient) {
        initTokenClient();
    }
    return tokenClient;
}

let codeClient: google.accounts.oauth2.CodeClient;
export function initCodeClient() {
    codeClient = google.accounts.oauth2.initCodeClient({
        client_id: conf.client_id,
        scope: SCOPES,
        ux_mode: "popup",
        callback: (resp) => {
            (window as any).authCode = resp;
        },
    });
}
export function getCodeClient(): google.accounts.oauth2.CodeClient {
    if (!codeClient) {
        initCodeClient();
    }
    return codeClient;
}
