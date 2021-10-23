import React, {useContext, useEffect, useState} from 'react'
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, ScrollView, Image, FlatList} from 'react-native'
import {Feather} from "@expo/vector-icons";

import {uStyles, colors} from '../styles.js'
import {FirebaseContext} from "../context/FirebaseContext"
import { UserContext } from '../context/UserContext'

export default ExploreScreen = () => {

    const [user, setUser] = useContext(UserContext);
    const firebase = useContext(FirebaseContext);
    const [portfolio, setPortfolio] = useState([]);
    const [score, setScore] = useState(0)

    useEffect(() => {
        // TODO: load portfolio from server, including overall score
        setScore(calculate_portfolio_score());
    }, []);

    const calculate_portfolio_score = () => {
        let types = {}
        let count = 0
        for (let item in portfolio) {
            count += 1
            types[item["name"]] = true
        }
        return count * Object.keys(types).length;
    }
    

    return (
        <View style={styles.container}>

            {/* <Text style={[uStyles.header, {marginTop: 16, marginBottom: 16}]}>{user.email.toLowerCase()}</Text> */}
            <Text style={[uStyles.header, {marginTop: 16, marginBottom: 16}]}>Your collection is worth {score} points!</Text>
            <Text style={[uStyles.body, {textAlign: "center", marginBottom: 16, paddingHorizontal: 16}]}>A larger, more varied collection gets you more points and more rewards!</Text>



            <FlatList 
                style={{ padding: 16}}
                data={portfolio}
                renderItem={(toy) => <ToyView image={toy.item.image} name={toy.item.name}/>}
                keyExtractor={(item, index) => index}
                showsVerticalScrollIndicator
                numColumns={2}
            />

        </View>

    );
}

const ToyView = (props) => {
    return (
        <View style={{padding: 8}}>
            <Text style={[uStyles.subheader, {padding: 4, textAlign: "center"}]}>{props.name}</Text>
            <Image style={{width: 150, height: 150, resizeMode: "contain", borderRadius: 8}} source={{uri: props.image}}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark,
    },
});