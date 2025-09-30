import {auth} from "./firebase/config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const handleSignUp = async(fullname, email , password) =>{
    try{
        const userCredential = await createUserWithEmailAndPassword(auth, fullname, email, password);
        console.log("User signed up: ", userCredential.user);
    } catch(error){
        console.error("Signup error:", error.message);
    }
}

export const auth = getAuth(app);

const handleLogIn = async(email, password) =>{
    try {
        const userCredential = await signInWithEmailAndPassword
    } catch (error) {
        
    }
}