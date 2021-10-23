import React, {createContext} from 'react'
import firebase from 'firebase/app'
import { initializeApp } from '@firebase/app'
import { getFirestore, doc, setDoc, collection, getDoc, updateDoc } from '@firebase/firestore'
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, sendPasswordResetEmail} from '@firebase/auth'
import { getStorage, ref, getDownloadURL } from '@firebase/storage'
import 'firebase/auth'
import 'firebase/firestore'

import config from '../config/firebase'

const FirebaseContext = createContext();

initializeApp(config);

const db = getFirestore();

const Firebase = {
    // main app functions
   
    // auth functions
    getCurrentUser: () => {
        return getAuth().currentUser;
    },
    createUser: async (user) => {
        try {
            await createUserWithEmailAndPassword(getAuth(), user.email, user.password);
            // await Firebase.sendEmailVerification();

            const uid = Firebase.getCurrentUser().uid;
            let profilePhotoUrl = "default";

            console.log("hi 3")
            console.log(uid)


            await setDoc(doc(db, "users", uid), {
                username: user.name,
                email: user.email,
                profilePhotoUrl: profilePhotoUrl
            });
            console.log("hi 2")

            // if (user.profilePhoto) {
            //     profilePhotoUrl = await Firebase.uploadProfilePhoto(user.profilePhoto);
            // }

            delete user.password;
            console.log("hi 1")
            return {...user, profilePhotoUrl, uid};
        } catch (error) {
            console.log("Error @createUser: ", error.message);
            throw error;
        }
    },
    uploadProfilePhoto: async (uri) => {
        const uid = Firebase.getCurrentUser().uid;

        try {
            const photo = await Firebase.getBlob(uri);
            const imageRef = ref("profilePhotos", uid);
            const task = await uploadBytes(imageRef, photo);
            const url = await getDownloadURL(task.snapshot.ref);

            await updateDoc(doc(db, "users", uid), {
                profilePhotoUrl: url
            });

            return url;
        } catch (error) {
            console.log("Error @uploadProfilePhoto: ", error.message);
        }
    },
    getBlob: async (uri) => {
        return await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.onload = () => {
                resolve(xhr.response);
            }
            xhr.onerror = () => {
                reject(new TypeError("Network request failed."));
            }

            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        })
    },
    getUserInfo: async (uid) => {
        try {
            const userRef = collection(db, "users", uid);
            const user = getDoc(userRef);
            if (user.exists) {
                return user.data();
            }
        } catch (error) {
            console.log("Error @getUserInfo: ", error.message);
        }
    },
    sendEmailVerification: async () => {
        const user = Firebase.getCurrentUser();
        if (user) {
            sendEmailVerification(user);
        }
    },
    sendPasswordResetEmail: async (email) => {
        const user = Firebase.getCurrentUser();
        if (user) {
            sendPasswordResetEmail(getAuth(), email);
        }
    },
    logOut: async () => {
        try {
            await getAuth().signOut();
            return true;
        } catch (error) {
            console.log("Error @logOut: ", error.message);
        }
        return false;
    },
    logIn: async(email, password) => {
        return signInWithEmailAndPassword(getAuth(), email, password);
    }
};

const FirebaseProvider = (props) => {
    return <FirebaseContext.Provider value={Firebase}>{props.children}</FirebaseContext.Provider>
}

export {FirebaseContext, FirebaseProvider};