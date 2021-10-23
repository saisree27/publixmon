import AsyncStorage from '@react-native-community/async-storage';
    
const SETTINGS = 'settings';

const setLocalSettings = async (settings) => {
    await AsyncStorage.setItem(SETTINGS, JSON.stringify(settings));
}

const getLocalSettings = async() => {
    try {
        const value = await AsyncStorage.getItem(SETTINGS);
        if (value !== null) {
            return (JSON.parse(value));
        } else {
            return null;
        }
    } catch (error) {
        console.log("Error @getLocalSettings: ", error.message);
    }
}

export {setLocalSettings, getLocalSettings};