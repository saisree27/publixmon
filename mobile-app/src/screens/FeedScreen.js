import React, {useState, useEffect, useContext} from 'react'
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
    const [location, setLocation] = useState();
    

    useEffect(() => {
        const _getLocationAsync = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('denied')
            }
            let locations = await Location.watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 10000, distanceInterval: 1 }, (loc) => setLocation(loc.coords));           
        }
        _getLocationAsync()
    }, [])

    useEffect(() => {
        // TODO: update marker locally
        // TODO: update location on server
    }, [location])
 

    return (
        <View style={styles.container}>
            <View>
                <MapView style={styles.map} pointerEvents="none"/>
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
