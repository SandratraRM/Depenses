import firebase from "./firebase";
import {
    Auth,
    browserLocalPersistence,
    getAuth,
    GoogleAuthProvider,
    setPersistence,
    signInWithPopup,
    User,
} from "firebase/auth";
const auth: Auth = getAuth(firebase);

export async function loginWithGoogle() {
    await setPersistence(auth, browserLocalPersistence);
    if (!auth.currentUser) {
        const provider: GoogleAuthProvider = new GoogleAuthProvider();
        provider.addScope("https://www.googleapis.com/auth/drive");
        await signInWithPopup(auth, provider);
    }
    return auth.currentUser;
}

export async function getLoggedUser() {
    await setPersistence(auth, browserLocalPersistence);
    return auth.currentUser;
}

export async function logout() {
    return auth.signOut();
}
export async function getToken(user: User) {
    return await user.getIdToken();
}
