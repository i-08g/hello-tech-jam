import { initializeApp } from "firebase/app"

export const severActioninInitializeApp=async()=>{
    const firebaseConfig = {
        apiKey:process.env.FIREBASE_API_KEY,
        authDomain: "attack-on-lapin-18373.firebaseapp.com",
        projectId: "attack-on-lapin-18373",
        storageBucket: "attack-on-lapin-18373.appspot.com",
        messagingSenderId: "479249872302",
        appId: "1:479249872302:web:2863c47ece28ce092f043f"
      }
    return initializeApp(firebaseConfig)
}