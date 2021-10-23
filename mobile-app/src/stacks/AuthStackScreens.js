import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack'

import LoginScreen from '../screens/LoginScreen'
import SignUpScreen from '../screens/SignUpScreen'

export default AuthStackScreens = () => {
    const AuthStack = createStackNavigator();

    return (
        <AuthStack.Navigator headerMode="none">
            <AuthStack.Screen name="SignUp" component={SignUpScreen}/>
            <AuthStack.Screen name="LogIn" component={LoginScreen}/>
        </AuthStack.Navigator>
    );
}