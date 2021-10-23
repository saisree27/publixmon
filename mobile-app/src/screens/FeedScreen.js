import React, {useState, useEffect, useContext, useRef} from 'react'
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, FlatList, Modal, ScrollView, Dimensions} from 'react-native'
import {StatusBar} from 'expo-status-bar';
import {Feather} from "@expo/vector-icons";
import * as Reanimatable from 'react-native-animatable';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

import {uStyles, colors} from '../styles.js'
import {FirebaseContext} from "../context/FirebaseContext"
import checkIfFirstLaunch from '../scripts/CheckFirstLaunch';

export default FeedScreen = () => {
    const firebase = useContext(FirebaseContext);
    const mapRef = useRef()
    const [location, setLocation] = useState();
    const [region, setRegion] = useState();

    useEffect(() => {
        const _getLocationAsync = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert("Please give this app location permissions to be able to meet and trade with others!")
            }
            let locations = await Location.watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 10000, distanceInterval: 1 }, (loc) => setLocation(loc.coords));           
        }
        _getLocationAsync()

        const interval = setInterval(() => {
            updateLocations();
          }, 10000); // 10 seconds
        
          return () => clearInterval(interval);
    }, [])

    useEffect(() => {
        setRegion({...location, latitudeDelta: 0.001, longitudeDelta: 0.001})
        
     
        // TODO: update user location on server
    }, [location])

    const updateLocations = async () => {
        // TODO: get locations of other users in same store from server
        console.log('todo')
    }
 

    return (
        <View style={styles.container}>
            <View>
                <MapView style={styles.map} minZoomLevel={18} region={region}>
                    <Marker coordinate={location} title={"You"}/>
                </MapView>
            </View>

            <StatusBar style="dark" />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark,
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});
