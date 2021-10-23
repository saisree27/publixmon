import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack'

import {UserContext} from '../context/UserContext'
import AuthStackScreens from './AuthStackScreens'
import MainStackScreens from './MainStackScreens'
import LoadingScreen from '../screens/LoadingScreen'

export default AppStackScreens = () => {
    const AppStack = createStackNavigator();
    const [user] = useContext(UserContext);

    return (
        <AppStack.Navigator>
            {user.isLoggedIn === null ? (
                <AppStack.Screen name="Loading" component={LoadingScreen} options={{headerShown: false}}/>
            ) : user.isLoggedIn ? (
                <AppStack.Screen name="Main" component={MainStackScreens} options={{headerShown: false}}/>
            ) :(
                <AppStack.Screen name="Auth" component={AuthStackScreens} options={{headerShown: false}}/>
            )}
        </AppStack.Navigator>
    );
}
