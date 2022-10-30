
import conf from "./Conf";
const SHEETS_DISCOVERY_DOC = "https://sheets.googleapis.com/$discovery/rest?version=v4";
const OATH2_DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/oauth2/v1/rest";
export default function initGapi() {
    return new Promise<void>((resolve, reject) => {
        window.gapi.load("client", () => {
            window.gapi.client.init({
                clientId: conf.client_id,
                discoveryDocs: [SHEETS_DISCOVERY_DOC, OATH2_DISCOVERY_DOC],
            }).then(() => {
                resolve();
            }).catch((e) => {
                reject(e);
            });
        });
    });
}
