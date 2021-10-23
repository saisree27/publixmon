import React from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {Feather} from '@expo/vector-icons'

import FeedScreen from '../screens/FeedScreen'
import ProfileScreen from '../screens/ProfileScreen'
import {uStyles, colors} from '../styles.js'

export default MainStackScreens = () => {
    const MainStack = createBottomTabNavigator();

    const tabBarOptions = {
        showLabel: false,
        style: uStyles.tabBar,
    }

    const screenOptions = (({route}) => ({
        tabBarIcon: ({focused}) => {
            let iconName = "";
            switch (route.name) {
                case "Feed":
                    iconName = "home";
                    break;
                case "Explore":
                    iconName = "compass";
                    break;
                case "Post":
                    iconName = "plus-circle";
                    break;
                case "Game":
                    iconName = "trending-up";
                    break;
                case "Profile":
                    iconName = "user";
                    break;
                default:
                    iconName = "home";
            }

            // if (route.name == "Post") {
            //     return <Feather name={iconName} size={48} color={focused ? colors.primary : colors.white}/>;
            // }
            return <Feather name={iconName} size={24} color={focused ? colors.primary : colors.light} />;
        }
    }))

    return (
        <MainStack.Navigator tabBarOptions={tabBarOptions} screenOptions={screenOptions}>
            <MainStack.Screen name="Feed" component={FeedScreen}/>
            <MainStack.Screen name="Profile" component={ProfileScreen}/>
        </MainStack.Navigator>
    );
}