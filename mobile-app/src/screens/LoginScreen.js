import React, {useState, useContext} from 'react'
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, ScrollView, ActivityIndicator, KeyboardAvoidingView} from 'react-native'
import {StatusBar} from 'expo-status-bar';

import {uStyles, colors} from '../styles'
import {UserContext} from '../context/UserContext'
import {FirebaseContext} from "../context/FirebaseContext"

export default LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState();
    const [loading, setLoading] = useState(false);   
    const firebase = useContext(FirebaseContext);
    const [_, setUser] = useContext(UserContext);

    handleLogin = async () => {
        setLoading(true);

        try {
            // await firebase.logIn(email, password);

            // const uid = firebase.getCurrentUser().uid;
            // const userInfo = await firebase.getUserInfo(uid);
            // const emailVerified = firebase.getCurrentUser().emailVerified;

            // if (!emailVerified) {
            //     setErrorMessage("Your email is not verified. Check your inbox.");
            // }

            // todo: query server to make sure unique email

            setUser({
                username: email,
                // email: userInfo.email,
                // uid,
                // profilePhotoUrl: userInfo.profilePhotoUrl,
                isLoggedIn: true,
            });
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    resetPassword = () => {
        try {
            firebase.sendPasswordResetEmail(email);
            setErrorMessage("Email sent!");
        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    resendVerification = () => {
        try {
            firebase.sendEmailVerification();
            setErrorMessage("Email sent!");
        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    return(
        <KeyboardAvoidingView behavior={"padding"} style={styles.container}>
            <ScrollView style={styles.container}>
                <Text style={uStyles.header}>
                    {'Welcome to Publixmon.'}
                </Text>

                <View style={styles.errorMessage}>
                    {errorMessage && <Text style={uStyles.message}>{errorMessage}</Text>}
                </View>
                
                <View style={styles.form}>
                    <View>
                        <Text style={uStyles.subheader}>Email</Text>
                        <TextInput 
                            style={uStyles.input} 
                            autoCapitalize='none' 
                            autoCompleteType="email"
                            autoCorrect={false}
                            onChangeText={email => setEmail(email.trim())}
                            value={email}
                        ></TextInput>
                    </View>

                    {/* <View style={{marginTop: 16}}>
                        <Text style={uStyles.subheader}>Password</Text>
                        <TextInput 
                            style={uStyles.input} 
                            secureTextEntry 
                            autoCapitalize='none'
                            autoCorrect={false}
                            autoCompleteType="password"
                            onChangeText={password => setPassword(password.trim())}
                            value={password}
                        ></TextInput>
                    </View> */}
                </View>

                <TouchableOpacity style={uStyles.textButton} onPress={() => handleLogin()}>
                    {loading ? (
                        <ActivityIndicator size="small" color={colors.white}/>
                    ) : (
                        <Text style={uStyles.subheader}>Log In</Text>
                    )}
                </TouchableOpacity>

                {/* <TouchableOpacity style={{alignSelf: "center", marginTop: 32}} onPress={() => resetPassword()}>
                    <Text style={uStyles.message}>
                        Reset password.
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{alignSelf: "center", marginTop: 32}} onPress={() => resendVerification()}>
                    <Text style={uStyles.message}>
                        Resend verification email.
                    </Text>
                </TouchableOpacity> */}
{/* 
                <TouchableOpacity style={{alignSelf: "center", marginTop: 32}} onPress={() => navigation.navigate("SignUp")}>
                    <Text style={uStyles.message}>
                        New around here? <Text style={uStyles.message, {color: colors.primary}}>Sign up.</Text>
                    </Text>
                </TouchableOpacity> */}
                <StatusBar style="light" />
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark,
    },
    errorMessage: {
        height: 72,
        alignItems: 'center',
        justifyContent: "center",
        marginHorizontal: 32
    },
    form: {
        marginBottom: 48,
        marginHorizontal: 36
    },
})