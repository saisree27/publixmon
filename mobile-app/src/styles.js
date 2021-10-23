import {StyleSheet} from 'react-native'

// for theming that needs to be consistently reused across the app
const colors = {
    primary: "#ff8c08",//"#E9446A",
    white: "#FEFCFD",
    black: "#272727",//#010400",
    dark: "#384051",//"#1d3557",//"#5603AD"
    light: "#D4E0F1"//"#BFCDE0"//"#8B80F9",
}

const uStyles = StyleSheet.create({
    title: {
        marginTop: 96,
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center",
        color: colors.primary,
    },
    header: {
        marginTop: 96,
        fontSize: 18,
        fontWeight: "700",
        textAlign: "center",
        color: colors.black,
    },
    subheader: {
        color: colors.black,
        fontSize: 16,
        fontWeight: "700",
    },
    body: {
        color: colors.dark,
        fontSize: 14,
        fontWeight: "600",
    },
    toggleProfile: {
        color: colors.black,
        fontSize: 16,
        fontWeight: "700",
    },
    message: {
        color: colors.dark,
        fontSize: 12,
        fontWeight: "600",
    },
    input: {
        backgroundColor: colors.light,
        height: 48,
        fontSize: 14,
        fontWeight: "600",
        color: colors.dark,
        borderRadius: 10,
        paddingHorizontal: 16,
        marginTop: 8,
        borderBottomColor: colors.light,
        borderBottomWidth: 4
    },
    textButton: {
        marginHorizontal: 80,
        backgroundColor: colors.primary,
        borderRadius: 10,
        height: 64,
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: {width: -4, height: 4},
        shadowColor: colors.black,    
        alignItems: "center",
        justifyContent: "center",   
    },
    roundButton: {
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: {width: -4, height: 4},
        width: 48, 
        height: 48, 
        backgroundColor: colors.black, 
        shadowColor: colors.primary, 
        marginTop: 12
    },
    roundButtonArray: {
        position: "absolute", 
        right: 8, 
        bottom: 108
    },
    pfpBubble: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.light,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 48,
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: {width: -4, height: 4},
        shadowColor: colors.black,
    },
    pfp: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.light,
        justifyContent: "center",
        alignItems: "center",
        overflow: 'hidden'
    },
    tabBar: {
        backgroundColor: colors.black,
        paddingBottom: 12,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position:'absolute',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: {width: -4, height: -1},
        shadowColor: colors.primary,
    },
    topBar: {
        backgroundColor: colors.black,
        width: "100%",
        padding: 16,
        height: 96,
        flexDirection: "row",
        justifyContent: "space-between",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: {width: -4, height: 4},
        shadowColor: colors.primary,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        position: "absolute"
    },
    postCard: {
        backgroundColor: colors.light,
        borderRadius: 20,
        marginTop: 16,
        width: "100%",
        height: 550,
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: {width: -8, height: 8},
        shadowColor: colors.black,
        alignSelf: "center",
    }, 
    tag: {
        borderRadius: 8,
        padding: 4,
        marginHorizontal: 8
    },
    modal: {
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        backgroundColor: colors.white,
        height: "100%",
        width: "100%",
        marginTop: 128,
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: {width: -8, height: -4},
        shadowColor: colors.black,
        alignSelf: "center",
    },
    commentCard: {
        backgroundColor: colors.white,
        marginRight: 12,
        marginLeft: 12,
        marginTop: 16,
        padding: 12,
        borderRadius: 20
    },
    profileCard: {
        backgroundColor: colors.dark,
        marginRight: 12,
        marginLeft: 12,
        marginTop: 16,
        padding: 12,
        borderRadius: 20
    },
    searchCard: {
        backgroundColor: colors.light,
        marginRight: 12,
        marginLeft: 12,
        marginTop: 16,
        padding: 12,
        height: "40%",
        borderRadius: 20,
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: {width: -4, height: 4},
        shadowColor: colors.black,
    },
    camera: {
        width: "100%",
        height: 550,
        marginTop: 12,
        borderRadius: 20
    }
})

export {uStyles, colors};
