import React, { useState, useContext } from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList, Switch, Alert} from 'react-native'
import {Feather} from "@expo/vector-icons";

import {uStyles, colors} from '../styles.js'
import { SettingsContext } from '../context/SettingsContext.js'
import {FirebaseContext} from "../context/FirebaseContext";
import { UserContext } from '../context/UserContext'
import {setLocalSettings, getLocalSettings} from '../scripts/LocalSettings'

export default SettingsModal = (props) => {
    const [settings, setSettings] = useContext(SettingsContext);
    const firebase = useContext(FirebaseContext);
    const [user, setUser] = useContext(UserContext);

    const renderSetting = (key) => {
        return (
            <SettingCard settingKey={key} item={settings[key]} toggle={() => toggleSwitch(key)}/>
        )
    }

    const toggleSwitch = (key) => {
        let oldSettings = settings;
        oldSettings[key].value = !oldSettings[key].value;
        setSettings(oldSettings);
    }

    const logOut = async () => {
        const loggedOut = await firebase.logOut();
        if (loggedOut) {
            setUser(state => ({...state, isLoggedIn: false}))
        }
    }

    const deleteAccount = async () => {
        Alert.alert(
            "Delete Account",
                "Are you sure you want to permanently delete your account?",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                    onPress: () => {return;}
                  },
                  {
                    text: "Yes",
                    onPress: () => {
                        firebase.getCurrentUser().delete();
                        //TO-DO: delete posts and other things
                    }
                  }
                ]
            );
    }

    return (
        <View style={uStyles.modal}>
            <TouchableOpacity onPress={() => {
                props.close();
                setLocalSettings(settings);
            }} style={{alignSelf: 'flex-end', marginRight: 12, marginTop: 12}}>
                <Feather name="x" size={32} color={colors.black}/>
            </TouchableOpacity>


            <ScrollView>
                <FlatList
                    data={Object.keys(settings)}
                    renderItem={(key) => renderSetting(key.item)}
                    keyExtractor={(item) => item.name}
                    style={{flex: 1, paddingTop: 12}}
                    contentContainerStyle={{paddingBottom: 32, paddingTop: 12}}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews={true} // Unmount components when outside of window 
                    initialNumToRender={2} // Reduce initial render amount
                    maxToRenderPerBatch={1} // Reduce number in each render batch
                />

                <Text style={[uStyles.subheader, {color: colors.black, marginLeft: 36}]}>Account Info</Text>
                <Text style={[uStyles.body, {color: colors.black, marginLeft: 36, marginTop: 16}]}>{user.username}</Text>
                <Text style={[uStyles.body, {color: colors.black, marginLeft: 36}]}>{user.email}</Text>

                <TouchableOpacity style={{alignSelf: "center", marginTop: 32}} onPress={() => logOut()}>
                    <Feather name="log-out" size={24} color={colors.black}/>
                </TouchableOpacity>
                {/* <TouchableOpacity style={{alignSelf: "center", marginTop: 32}} onPress={() => deleteAccount()}>
                    <Feather name="user-x" size={24} color={colors.black}/>
                </TouchableOpacity> */}
            </ScrollView>
        </View>
    );
}

const SettingCard = (props) => {
    const [enabled, setEnabled] = useState(props.item.value);

    return (
        <View style={[uStyles.commentCard, {flexDirection: "row", alignItems: "center", justifyContent: "space-between"}]}>
            <Text style={[uStyles.body, {color: colors.black, marginLeft: 12}]}>{props.item.name}</Text>
            <Switch
                trackColor={{ false: colors.light, true: colors.primary }}
                thumbColor={colors.white}
                ios_backgroundColor={colors.light}
                onValueChange={() => {
                    props.toggle(props.settingKey);
                    setEnabled(!enabled);
                }}
                value={enabled}
            />
        </View>
    );
}