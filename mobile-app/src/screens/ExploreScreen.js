import React, {useContext, useEffect, useState} from 'react'
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, ScrollView, Image, FlatList, Modal} from 'react-native'
import {Feather} from "@expo/vector-icons";
import Constants from "expo-constants";
import * as Reanimatable from 'react-native-animatable';

import {uStyles, colors} from '../styles.js'
import {FirebaseContext} from "../context/FirebaseContext"
import { UserContext } from '../context/UserContext'

const { manifest } = Constants;
// const uri = `http://${manifest.debuggerHost.split(':').shift()}:5000`;
const uri = `https://hackgt-8-publixmon.herokuapp.com/`;

export default ExploreScreen = () => {
     let temp = [{name: "bananananan", image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwBQTFRF7c5J78kt+/Xm78lQ6stH5LI36bQh6rcf7sQp671G89ZZ8c9V8c5U9+u27MhJ/Pjv9txf8uCx57c937Ay5L1n58Nb67si8tVZ5sA68tJX/Pfr7dF58tBG9d5e8+Gc6chN6LM+7spN1pos6rYs6L8+47hE7cNG6bQc9uFj7sMn4rc17cMx3atG8duj+O7B686H7cAl7cEm7sRM26cq/vz5/v767NFY7tJM78Yq8s8y3agt9dte6sVD/vz15bY59Nlb8txY9+y86LpA5LxL67pE7L5H05Ai2Z4m58Vz89RI7dKr+/XY8Ms68dx/6sZE7sRCzIEN0YwZ67wi6rk27L4k9NZB4rAz7L0j5rM66bMb682a5sJG6LEm3asy3q0w3q026sqC8cxJ6bYd685U5a457cIn7MBJ8tZW7c1I7c5K7cQ18Msu/v3678tQ3aMq7tNe6chu6rgg79VN8tNH8c0w57Q83akq7dBb9Nld9d5g6cdC8dyb675F/v327NB6////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/LvB3QAAAMFJREFUeNpiqIcAbz0ogwFKm7GgCjgyZMihCLCkc0nkIAnIMVRw2UhDBGp5fcurGOyLfbhVtJwLdJkY8oscZCsFPBk5spiNaoTC4hnqk801Qi2zLQyD2NlcWWP5GepN5TOtSxg1QwrV01itpECG2kaLy3AYiCWxcRozQWyp9pNMDWePDI4QgVpbx5eo7a+mHFOqAxUQVeRhdrLjdFFQggqo5tqVeSS456UEQgWE4/RBboxyC4AKCEI9Wu9lUl8PEGAAV7NY4hyx8voAAAAASUVORK5CYII='}, {name: "bananananan", image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwBQTFRF7c5J78kt+/Xm78lQ6stH5LI36bQh6rcf7sQp671G89ZZ8c9V8c5U9+u27MhJ/Pjv9txf8uCx57c937Ay5L1n58Nb67si8tVZ5sA68tJX/Pfr7dF58tBG9d5e8+Gc6chN6LM+7spN1pos6rYs6L8+47hE7cNG6bQc9uFj7sMn4rc17cMx3atG8duj+O7B686H7cAl7cEm7sRM26cq/vz5/v767NFY7tJM78Yq8s8y3agt9dte6sVD/vz15bY59Nlb8txY9+y86LpA5LxL67pE7L5H05Ai2Z4m58Vz89RI7dKr+/XY8Ms68dx/6sZE7sRCzIEN0YwZ67wi6rk27L4k9NZB4rAz7L0j5rM66bMb682a5sJG6LEm3asy3q0w3q026sqC8cxJ6bYd685U5a457cIn7MBJ8tZW7c1I7c5K7cQ18Msu/v3678tQ3aMq7tNe6chu6rgg79VN8tNH8c0w57Q83akq7dBb9Nld9d5g6cdC8dyb675F/v327NB6////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/LvB3QAAAMFJREFUeNpiqIcAbz0ogwFKm7GgCjgyZMihCLCkc0nkIAnIMVRw2UhDBGp5fcurGOyLfbhVtJwLdJkY8oscZCsFPBk5spiNaoTC4hnqk801Qi2zLQyD2NlcWWP5GepN5TOtSxg1QwrV01itpECG2kaLy3AYiCWxcRozQWyp9pNMDWePDI4QgVpbx5eo7a+mHFOqAxUQVeRhdrLjdFFQggqo5tqVeSS456UEQgWE4/RBboxyC4AKCEI9Wu9lUl8PEGAAV7NY4hyx8voAAAAASUVORK5CYII='}];

    const [user, setUser] = useContext(UserContext);
    const firebase = useContext(FirebaseContext);
    const [portfolio, setPortfolio] = useState([]);
    const [score, setScore] = useState(0)

    useEffect(() => {
        load_portfolio();
    }, []);

    const load_portfolio = async () => {
        // load portfolio from server
        let res = await fetch(uri + "/getportfolio", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: user.email,
            })
        });
        res = await res.json();
        res = res.res;
        setScore(calculate_portfolio_score(res));
        setPortfolio(res);
    }

    const calculate_portfolio_score = (port) => {
        let types = {}
        let count = 0
        for (let item of port) {
            count += 1;
            types[item["name"]] = true
        }
        return count * Object.keys(types).length;
    }
    

    return (
        <View style={styles.container}>

            {/* <Text style={[uStyles.header, {marginTop: 16, marginBottom: 16}]}>{user.email.toLowerCase()}</Text> */}
            <Text style={[uStyles.header, {marginTop: 16, marginBottom: 16}]}>Your collection is worth <Text style={{color: colors.primary}}>{score} points!</Text></Text>
            <Text style={[uStyles.message, {textAlign: "center", marginBottom: 16, paddingHorizontal: 64}]}>A larger, more varied collection gets you more points and more rewards!</Text>
           
            <TouchableOpacity style={{alignSelf: "center", padding: 8, shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: {width: -4, height: 4}, shadowColor: colors.black}} onPress={() => load_portfolio()}>
                <Feather name="refresh-cw" size={24} color={colors.black}/>
            </TouchableOpacity>


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
    const [nftVisible, setNFTVisible] = useState(false);

    const showToy = () => {
        setNFTVisible(true);
    }

    return (
        <Reanimatable.View animation={"tada"} duration={500}>
            <TouchableOpacity style={{padding: 8, shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: {width: -4, height: 4}, shadowColor: colors.black}} onPress={() => showToy()}>
                <Text style={[uStyles.message, {padding: 4, textAlign: "center"}]}>{props.name}</Text>
                <Image style={{width: 150, height: 150, resizeMode: "contain", borderRadius: 8}} source={{uri: 'data:image/png;base64,' + props.image}}/>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={nftVisible}
                onRequestClose={() => setNFTVisible(false)}
            >
                <NFTModal name={props.name} close={() => {setNFTVisible(false)}}/>
            </Modal>
        </Reanimatable.View>
    )
}

const NFTModal = (props) => {

    return (
        <View style={uStyles.modal}>
            <TouchableOpacity onPress={() => props.close()} style={{alignSelf: 'flex-end', marginRight: 12, marginTop: 12}}>
                <Feather name="x" size={32} color={colors.black}/>
            </TouchableOpacity>
            <Text style={[uStyles.body, {textAlign: "center", color: colors.dark}]}>{props.name}</Text>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
});