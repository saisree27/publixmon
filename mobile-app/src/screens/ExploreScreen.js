import React, {useContext, useEffect, useState} from 'react'
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, ScrollView, FlatList, Modal} from 'react-native'
import {Feather} from "@expo/vector-icons";

import {uStyles, colors} from '../styles.js'
import {FirebaseContext} from "../context/FirebaseContext"
import { UserContext } from '../context/UserContext'

export default ExploreScreen = () => {
    const [user, setUser] = useContext(UserContext);
    const firebase = useContext(FirebaseContext);
    const [userData, setUserData] = useState();

    useEffect(() => {

    }, []);

    

    return (
        <View style={styles.container}>

            <Text style={[uStyles.header, {marginTop: 16}]}>{user.email.toLowerCase()}</Text>


            <View style={{alignItems: "center", display: "flex", justifyContent: "center", padding: 128}}>

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