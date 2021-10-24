import React, {useContext, useEffect, useState} from 'react'
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, ScrollView, FlatList, Modal} from 'react-native'
import {Feather, AntDesign} from "@expo/vector-icons";
import { BarCodeScanner } from 'expo-barcode-scanner';
import Constants from "expo-constants";
import {StatusBar} from 'expo-status-bar';

import {uStyles, colors} from '../styles.js'
import {FirebaseContext} from "../context/FirebaseContext"
import { UserContext } from '../context/UserContext'
import {ImageUpload} from '../scripts/ImageUpload'
import { apiBackend } from '../scripts/NCR';

console.disableYellowBox = true;

const { manifest } = Constants;
const uri = `https://hackgt-8-publixmon.herokuapp.com/`;

export default ProfileScreen = () => {
    const [user, setUser] = useContext(UserContext);
    const firebase = useContext(FirebaseContext);

    const [scanned, setScanned] = useState(false);
    const [store, setStore] = useState("");
    const [update, setUpdate] = useState("");

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
        // Get random item from NCR API
        setUpdate("")
        apiBackend().then((result) => {
            console.log(result);    
            // generate toys on backend
            fetch(uri + "/styletransfer", {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    image: result,
                    email: user.email,
                })
            }).then((response) => response.json())
              .then((result) => {
                  console.log(result.img_name);
                  if (result.img_name === "NONE") {
                    setUpdate("You didn't get a toy this time...")
                  } else {
                    setUpdate("You got a new toy! Check your portfolio!")
                  }
              })
        })


    }

    const checkIn = async () => {
        setUpdate(null)
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        if (status !== 'granted') {
            alert("Please give this app camera permissions to be able to check in to stores!")
        }

        

    }

    const handleBarCodeScanned = ({ type, data }) => {
        setUpdate(null)
        if (data.includes("publixmon_store_id=")) {
            setScanned(true);
            let place = data.split("=")[1]
            setStore(place)
            setUser(state => ({...state, store: place}))
            alert(`Successfully checked in to ` + place + "!");
            checkInOnline(place)
        }
    };

    const checkInOnline = async (place) => {
        // add user to active users, update their store field
        let res = await fetch(uri + "/adduser", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: user.email,
                store: place
            })
        });
    }

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
     
            {!scanned ? 
             <View style={{alignItems: "center", display: "flex", justifyContent: "center", padding: 16}}>
                <Text style={[uStyles.body, {textAlign: "center"}]}>Scan the QR code at your store to check in.</Text>
                <TouchableOpacity style={{alignSelf: "center", marginTop: 32}} onPress={() => checkIn()}>
                    <AntDesign name="qrcode" size={24} color={colors.dark}/>
                </TouchableOpacity>
                <BarCodeScanner
                    onBarCodeScanned={handleBarCodeScanned}
                    style={{width: "80%", height: "50%", margin: 16, shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: {width: -4, height: 4}, shadowColor: colors.black}}
                />
            </View>
            :
            <View style={{alignItems: "center", display: "flex", justifyContent: "center", padding: 16}}>
                <Text style={[uStyles.body, {textAlign: "center"}]}>Done shopping at {store}? </Text>
                <TouchableOpacity style={{alignSelf: "center", marginTop: 32}} onPress={() => checkOut()}>
                    <Feather name="log-out" size={24} color={colors.dark}/>
                </TouchableOpacity>

 
            </View>
            }
            {update !== null ?
                <View>
                {update.length > 0 ? 
                    <View style={{...uStyles.commentCard, backgroundColor: colors.light, shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: {width: -4, height: 4}, shadowColor: colors.black}}>
                        <Text style={[uStyles.subheader, {textAlign: "center", padding: 16}]}>{update}</Text>
                    </View>
                :
                    <ActivityIndicator size="small" color={colors.dark}/>
                }
                </View>
            :  
                null
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
        backgroundColor: colors.white,
    },
});