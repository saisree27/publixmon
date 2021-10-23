import React, {useContext, useEffect, useState} from 'react'
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, ScrollView, Image, FlatList, Modal} from 'react-native'
import {Feather} from "@expo/vector-icons";
import Barcode from 'react-native-barcode-expo';

import {uStyles, colors} from '../styles.js'
import {FirebaseContext} from "../context/FirebaseContext"
import { UserContext } from '../context/UserContext'

export default RewardsScreen = () => {

    const [user, setUser] = useContext(UserContext);
    const firebase = useContext(FirebaseContext);
    const [coupons, setCoupons] = useState([{code: "1234", name: "5% off next purchase of $10 or more!"}, {code: "1243", name: "Buy 1 get 1 free for any Kellogg's cereal box!"}]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        // TODO: load coupons from server
    }, []);

    const deleteCoupon = (index) => {
        let couponList = coupons; // delete coupon from frontend
        if (index !== -1) {
            couponList.splice(index, 1);
        }
        setRefresh(!refresh)
        setCoupons(couponList);
    }
    

    return (
        <View style={styles.container}>

            {/* <Text style={[uStyles.header, {marginTop: 16, marginBottom: 16}]}>{user.email.toLowerCase()}</Text> */}
            <Text style={[uStyles.header, {marginTop: 16, marginBottom: 16}]}>You have {coupons.length} rewards to redeem!</Text>



            <FlatList 
                style={{ padding: 16}}
                data={coupons}
                renderItem={(coupon) => <CouponView coupon={coupon.item} coupons={coupons} deleteCoupon={(index) => deleteCoupon(index)}/>}
                keyExtractor={(item, index) => index}
                showsVerticalScrollIndicator
                extraData={refresh}

            />

        </View>

    );
}

const CouponView = (props) => {
    const [barcodeVisible, setBarcodeVisible] = useState(false);

    const redeem = () => {
        setBarcodeVisible(true);
        // TODO: delete coupon from server
    }

    return (
        <View>
            <TouchableOpacity style={{padding: 8, backgroundColor: colors.light, borderRadius: 4, margin: 8}} onPress={() => redeem()}>
                <Text style={[uStyles.subheader, {padding: 4, textAlign: "center", color: colors.dark}]}>Redeem {props.coupon.name}</Text>
            </TouchableOpacity>
        
            <Modal
                animationType="slide"
                transparent={true}
                visible={barcodeVisible}
                onRequestClose={() => setBarcodeVisible(false)}
            >
                <BarCodeModal coupon={props.coupon} close={() => {props.deleteCoupon(props.name); setBarcodeVisible(false);}}/>
            </Modal>
        </View>
        
                    
    )
}

const BarCodeModal = (props) => {

    return (
        <View style={uStyles.modal}>
            <TouchableOpacity onPress={() => props.close()} style={{alignSelf: 'flex-end', marginRight: 12, marginTop: 12}}>
                <Feather name="x" size={32} color={colors.black}/>
            </TouchableOpacity>
            <Text style={[uStyles.body, {textAlign: "center", color: colors.dark}]}>{props.coupon.name}</Text>
            <View style={{transform: [{ rotate: '90deg' }], marginTop: 128}}>
                <Barcode value={props.coupon.code} format="CODE128"/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark,
    },
});