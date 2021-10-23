import React, {useContext, useEffect, useState} from 'react'
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, ScrollView, FlatList, Modal} from 'react-native'
import {Feather, AntDesign} from "@expo/vector-icons";
import { BarCodeScanner } from 'expo-barcode-scanner';
import Constants from "expo-constants";

import {uStyles, colors} from '../styles.js'
import {FirebaseContext} from "../context/FirebaseContext"
import { UserContext } from '../context/UserContext'
import {ImageUpload} from '../scripts/ImageUpload'

console.disableYellowBox = true;

const { manifest } = Constants;
const uri = `http://${manifest.debuggerHost.split(':').shift()}:5000`;

export default ProfileScreen = () => {
    const [user, setUser] = useContext(UserContext);
    const firebase = useContext(FirebaseContext);

    const [scanned, setScanned] = useState(false);
    const [store, setStore] = useState("");

    const logOut = async () => {
        const loggedOut = await firebase.logOut();
        if (loggedOut) {
            setUser(state => ({...state, isLoggedIn: false}))
        }
    }

    const checkOut = async () => {
        setScanned(false);
        // remove user from active users, clear their store field, put in inactive users
        let res = await fetch(uri + "/removeuser", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: user.email,
            })
        });

        // TODO: generate toys on backend
    }

    const checkIn = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        if (status !== 'granted') {
            alert("Please give this app camera permissions to be able to check in to stores!")
        }
        // add user to active users, update their store field
        let res = await fetch(uri + "/adduser", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: user.email,
                store: store
            })
        });
        

    }

    const handleBarCodeScanned = ({ type, data }) => {
        if (data.includes("publixmon_store_id=")) {
            setScanned(true);
            let place = data.split("=")[1]
            setStore(place)
            setUser(state => ({...state, store: place}))
            alert(`Successfully checked in to ` + place + "!");
            checkIn();
        }
    };

    return (
        <View style={styles.container}>
     
            {!scanned ? 
             <View style={{alignItems: "center", display: "flex", justifyContent: "center", padding: 16}}>
                <Text style={[uStyles.body, {textAlign: "center"}]}>Scan the QR code at your store to check in.</Text>
                <TouchableOpacity style={{alignSelf: "center", marginTop: 32}} onPress={() => checkIn()}>
                    <AntDesign name="qrcode" size={24} color={colors.white}/>
                </TouchableOpacity>
                <BarCodeScanner
                    onBarCodeScanned={handleBarCodeScanned}
                    style={{width: "75%", height: "50%", margin: 8, padding: 16, borderRadius: 12}}
                />
            </View>
            :
            <View style={{alignItems: "center", display: "flex", justifyContent: "center", padding: 16}}>
                <Text style={[uStyles.body, {textAlign: "center"}]}>Done shopping at {store}? </Text>
                <TouchableOpacity style={{alignSelf: "center", marginTop: 32}} onPress={() => checkOut()}>
                    <Feather name="log-out" size={24} color={colors.white}/>
                </TouchableOpacity>

 
            </View>
            }
            <View style={{alignItems: "center", display: "flex", justifyContent: "center", padding: 16}}>
                <TouchableOpacity style={{alignSelf: "center", marginTop: 32}} onPress={() => logOut()}>
                    <Text style={uStyles.message, {color: colors.primary}}>
                        Log out
                    </Text>
                </TouchableOpacity>
            </View>

        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark,
    },
});