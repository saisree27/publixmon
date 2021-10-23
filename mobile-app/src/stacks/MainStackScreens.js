import React from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {Feather} from '@expo/vector-icons'

import FeedScreen from '../screens/FeedScreen'
import ProfileScreen from '../screens/ProfileScreen'
import ExploreScreen from '../screens/ExploreScreen'
import {uStyles, colors} from '../styles.js'
import RewardsScreen from '../screens/RewardsScreen'

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
                case "People Nearby":
                    iconName = "compass";
                    break;
                case "Your Portfolio":
                    iconName = "award";
                    break;
                case "Check In and Out":
                    iconName = "log-in";
                    break;
                case "Rewards":
                    iconName = "dollar-sign";
                    break;
                default:
                    iconName = "home";
            }

            // if (route.name == "Post") {
            //     return <Feather name={iconName} size={48} color={focused ? colors.primary : colors.white}/>;
            // }
            return <Feather name={iconName} size={24} color={focused ? colors.primary : colors.dark} />;
        }
    }))

    return (
        <MainStack.Navigator tabBarOptions={tabBarOptions} screenOptions={screenOptions}>
            <MainStack.Screen name="Check In and Out" component={ProfileScreen}/>
            <MainStack.Screen name="People Nearby" component={FeedScreen}/>
            <MainStack.Screen name="Your Portfolio" component={ExploreScreen}/>
            <MainStack.Screen name="Rewards" component={RewardsScreen}/>
        </MainStack.Navigator>
    );
}