import React, {useState, useEffect, useContext} from 'react'
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, FlatList, Modal, ScrollView} from 'react-native'
import {StatusBar} from 'expo-status-bar';
import {Feather} from "@expo/vector-icons";
import * as Reanimatable from 'react-native-animatable';

import {uStyles, colors} from '../styles.js'
import {FirebaseContext} from "../context/FirebaseContext"
import checkIfFirstLaunch from '../scripts/CheckFirstLaunch';

export default FeedScreen = () => {
    const firebase = useContext(FirebaseContext);
    

    useEffect(() => {
        
    }, []);

 

    return (
        <View style={styles.container}>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark,
    },
});
