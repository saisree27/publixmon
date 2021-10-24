import React, {useState, useEffect, useContext, useRef} from 'react'
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, FlatList, Modal, ScrollView, Dimensions} from 'react-native'
import {StatusBar} from 'expo-status-bar';
import {Feather} from "@expo/vector-icons";
import * as Reanimatable from 'react-native-animatable';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Constants from "expo-constants";


import {uStyles, colors} from '../styles.js'
import {FirebaseContext} from "../context/FirebaseContext"
import { UserContext } from '../context/UserContext'

const { manifest } = Constants;
// const uri = `http://${manifest.debuggerHost.split(':').shift()}:5000`;
const uri = `https://hackgt-8-publixmon.herokuapp.com/`;

export default FeedScreen = () => {
    const firebase = useContext(FirebaseContext);
    const mapRef = useRef()
    const [location, setLocation] = useState({latitude: 0.0, longitude: 0.0});
    const [otherLocations, setOtherLocations] = useState([]);
    const [region, setRegion] = useState();
    const [user, setUser] = useContext(UserContext);


    useEffect(() => {
        const _getLocationAsync = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert("Please give this app location permissions to be able to meet and trade with others!")
            }
            let locations = await Location.watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 10000, distanceInterval: 1 }, (loc) => setLocation(loc.coords));   
        }
        _getLocationAsync()

        const interval = setInterval(async () => {
            if (user['store'] !== undefined || user['store'].length > 0) {
                await updateLocations();
                await updateUserLocation({latitude: location['latitude'], longitude: location['longitude']});
            }
          }, 10000); // 10 seconds
        
          return () => clearInterval(interval);
    }, [])

    useEffect(() => {
        setRegion({...location, latitudeDelta: 0.001, longitudeDelta: 0.001})

    }, [location])

    const updateUserLocation = async (coords) => {
        let res = await fetch(uri + "/updatelocation", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: user.email,
                location: coords
            })
        });
        return
    }

    const updateLocations = async () => {
        // get locations of other users in same store from server
        let res = await fetch(uri + "/getlocations", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                store: user['store']
            })
        });
        res = await res.json();
        res = res.res;
        console.log("OUTPUT");
        console.log(res);
        setOtherLocations(res);
        return
    }
 

    return (
        <View style={styles.container}>
            <View>
                <MapView style={styles.map} minZoomLevel={18} region={region}>
                    <Marker coordinate={location} title={"You"} pinColor={colors.primary}/>
                    {otherLocations.map((spot, index) => spot !== null ? <Marker
                        key={index}
                        coordinate={spot}
                    /> : <></>)}
                </MapView>
            </View>

            <StatusBar style="dark" />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});
