import {auth} from "./firebase/config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const handleSignUp = async(fullname, email , password) =>{
    try{
        const userCredential = await createUserWithEmailAndPassword(auth, email, password).then((userCredential)=>{
            const user = userCredential.user;
            console.log("User signed up: ", userCredential.user);
        });
        
    } catch(error){
        const errorCode =  error.code;
        const errorMessage = error.message;
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