import React, {useContext, useEffect, useState} from 'react'
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, ScrollView, Image, FlatList, Modal} from 'react-native'
import {Feather} from "@expo/vector-icons";
import Barcode from 'react-native-barcode-expo';
import Constants from "expo-constants";

import {uStyles, colors} from '../styles.js'
import {FirebaseContext} from "../context/FirebaseContext"
import { UserContext } from '../context/UserContext'

const { manifest } = Constants;
const uri = `http://${manifest.debuggerHost.split(':').shift()}:5000`;

export default RewardsScreen = () => {

    const [user, setUser] = useContext(UserContext);
    const firebase = useContext(FirebaseContext);
    const [coupons, setCoupons] = useState([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        // TODO: load coupons from server
    }, []);

    const loadCoupons = async () => {
        let res = await fetch(uri + "/getcoupons", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: user.email,
            })
        });
        res = await res.json();
        res = res.res;
    }

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