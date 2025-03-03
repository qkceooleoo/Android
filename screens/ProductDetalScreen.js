import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const ProductDetailScreen = ({ route, navigation }) => {
    const { product } = route.params;

    return (
        <View style={styles.container}>
            <Image source={product.image} style={styles.image} />
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.price}>{product.price} VND</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Quay lại</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 10,
    },
    price: {
        fontSize: 18,
        color: "green",
    },
    button: {
        marginTop: 20,
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
});

export default ProductDetailScreen;
