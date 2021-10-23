import AsyncStorage from '@react-native-community/async-storage';
    
const HAS_LAUNCHED = 'hasLaunched';

const setAppLaunched = () => {
  AsyncStorage.setItem(HAS_LAUNCHED, 'true');
}

export default async function checkIfFirstLaunch () {
    try {
        const hasLaunched = await AsyncStorage.getItem(HAS_LAUNCHED);
        if (hasLaunched === null) {
            setAppLaunched();
            return true;
        }
        return false;
    } catch (error) {
        console.log("Error @checkIfFirstLaunch: ", error.message);
        return false;
    }
}