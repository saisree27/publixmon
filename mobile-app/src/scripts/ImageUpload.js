import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'

const ImageUpload = {
    pickImage: async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            })
            if (!result.cancelled) {
                return(result.uri)
            }
        } catch (error) {
            console.log("Error @pickImage: ", error.message);
        }
    },
    takeImage: async (camera) => {
        try {
            let uri = await camera.takePictureAsync().uri;
            return uri;
        } catch (error) {
            console.log("Error @takeImage: ", error.message);
        }
    },
    getMediaPermission: async () => {
        if (Platform.OS !== 'web') {
            const {status} = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
            return status;
        }
    },
    getCameraPermission: async () => {
        if (Platform.OS !== 'web') {
            const {status} = await Permissions.askAsync(Permissions.CAMERA);
            return status;
        }
    },
    addPhoto: async () => {
        const status = await ImageUpload.getMediaPermission();
        if (status !== "granted") {
            alert("We need permission to access your photos for this to work.");
            return;
        }
        return ImageUpload.pickImage();
    },
    takePhoto: async () => {
        const status = await ImageUpload.getCameraPermission();
        if (status !== "granted") {
            alert("We need permission to access your camera for this to work.");
            return;
        }
        return ImageUpload.takeImage();
    }
}

export {ImageUpload}