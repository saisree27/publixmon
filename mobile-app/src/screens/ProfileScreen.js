import React, {useContext, useEffect, useState} from 'react'
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, ScrollView, FlatList, Modal} from 'react-native'
import {Feather} from "@expo/vector-icons";

import {uStyles, colors} from '../styles.js'
import {FirebaseContext} from "../context/FirebaseContext"
import { UserContext } from '../context/UserContext'
import {ImageUpload} from '../scripts/ImageUpload'
import SettingsModal from '../components/SettingsModal.js';
console.disableYellowBox = true;

export default ProfileScreen = () => {
    const [user, setUser] = useContext(UserContext);
    const firebase = useContext(FirebaseContext);
    const [userData, setUserData] = useState();
    const [onboardingVisible, setOnboardingVisible] = useState(false);
    const [settingsVisible, setSettingsVisiible] = useState(false);
    const [notificationsVisible, setNotificationsVisible] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState(false);

    useEffect(() => {

    }, []);

    // const tempData = [
    //     {id: "141415252", username: "Aritro", uid: "8301u410", imageUrl: "houar", link: "https://expo.io", caption: "uaohfauwf", type: "Volunteering", cause: "Environment", likes: 32, profileVisits: 10, shares: 2, comments: [{id: "23804u2309", username: "Rohan", uid: "owrhf", text: "oierjhe"},]},
    //     {id: "1414152523", username: "Hane", uid: "238823", imageUrl: "ref", link: "", caption: "fefe", type: "Volunteering", cause: "Environment", likes: 33, profileVisits: 3, shares: 12, comments: [{id: "2049230942", username: "Rohan", uid: "owrhf", text: "oierjhe"},]},
    // ];

    const logOut = async () => {
        const loggedOut = await firebase.logOut();
        if (loggedOut) {
            setUser(state => ({...state, isLoggedIn: false}))
        }
    }

    const toggleOnboarding = () => {
        setOnboardingVisible(!onboardingVisible);
    }

    const toggleNotifications = () => {
        setNotificationsVisible(!notificationsVisible);
    }

    const toggleSettings = () => {
        setSettingsVisiible(!settingsVisible);
    }

    const renderPost = ({item}) => {
        return (
            <PostCard post={item} isOwn/>
        )
    }

    const addPostPhoto = async () => {
        const uri = await ImageUpload.addPhoto();
        if (uri) {
            let url = await firebase.uploadProfilePhoto(uri);
        }
    }

    return (
        <View style={styles.container}>
            {/* <ScrollView style={{marginTop: 64, marginTop: "40%"}}>
                <TouchableOpacity style={[uStyles.pfpBubble, {alignSelf: "center"}]} onPress={() => addPostPhoto()}>
                    <ImageBackground 
                        style={uStyles.pfp}
                        source={
                            user.profilePhotoUrl === "default" ?
                            require("../../assets/defaultProfilePhoto.png")
                            : {uri: user.profilePhotoUrl}
                        }
                    />
                </TouchableOpacity>
                <Text style={[uStyles.header, {marginTop: 16}]}>{user.email}</Text> 

                <Text style={[uStyles.title, {padding: 32, marginTop: 32}]}>...</Text>

            </ScrollView> */}

            {/* <Modal
                animationType="slide" 
                visible={settingsVisible} 
                onRequestClose={() => toggleSettings()}
                transparent={true}
            >
                <SettingsModal close={() => toggleSettings()}/>
            </Modal> */}

            <View style={{alignItems: "center", display: "flex", justifyContent: "center", padding: 128}}>

                <Text style={[uStyles.body]}>Done shopping?</Text>
                <TouchableOpacity style={{alignSelf: "center", marginTop: 32}} onPress={() => logOut()}>
                    <Feather name="log-out" size={24} color={colors.white}/>
                </TouchableOpacity>
            </View>

            


            {/* <View style={uStyles.topBar}>
                <Text style={[uStyles.title, {color: colors.primary, textAlign: 'left', marginTop: 32}]}>Profile</Text>
                <View style={{flexDirection: "row"}}>
         
                </View>
            </View> */}
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark,
    },
});