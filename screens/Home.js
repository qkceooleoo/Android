import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, FlatList, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from "react-native";

const API_URL = "http://localhost:5000/getall-product";
const HomeScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const searchRef = useRef("");
    const [products, setProducts] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedPriceRange, setSelectedPriceRange] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setProducts(data);
            setVisibleProducts(data);
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filteredProducts = products;
        if (selectedCategory) {
            filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
        }
        if (selectedPriceRange) {
            filteredProducts = filteredProducts.filter(p => p.price >= selectedPriceRange.min && p.price <= selectedPriceRange.max);
        }
        if (sortOrder === "asc") {
            filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortOrder === "desc") {
            filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
        }
        setVisibleProducts(filteredProducts);
    }, [selectedCategory, selectedPriceRange, sortOrder]);

    const handleSearch = () => {
        setSearchQuery(searchRef.current);
        let filteredProducts = products.filter((p) => p.title.toLowerCase().includes(searchRef.current.toLowerCase()));
        setVisibleProducts(filteredProducts);
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <FlatList
            keyboardShouldPersistTaps="handled"
            data={visibleProducts}
            keyExtractor={(item) => item._id.toString()}
            ListHeaderComponent={() => (
                <>
                    <View style={styles.headerContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <Text style={styles.backButton}>← Quay về</Text>
                        </TouchableOpacity>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Tìm kiếm sản phẩm"
                            defaultValue={searchRef.current}
                            onChangeText={(text) => (searchRef.current = text)}
                        />
                        <TouchableOpacity onPress={handleSearch}>
                            <Text style={styles.searchButton}>🔍</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.filterContainer}>
                        <TouchableOpacity onPress={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                            <Text style={styles.sortButton}>{sortOrder === "asc" ? "⬆ Sắp xếp giá tăng dần" : "⬇ Sắp xếp giá giảm dần"}</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
            renderItem={({ item }) => (
                <View style={styles.productCard}>
                    <Image source={{ uri: item.images[0] }} style={styles.productImage} />
                    <Text style={styles.productText}>{item.title} - {item.price} VND</Text>
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
        paddingTop: 30,
        backgroundColor: "#f8f8f8",
    },
    sortButton: {
        fontSize: 16,
        fontWeight: "bold",
        color: "blue",
        textAlign: "center",
        padding: 15,
    },
    productCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        marginVertical: 5,
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    productImage: {
        width: 60,
        height: 60,
        marginRight: 15,
        borderRadius: 10,
    },
    productText: {
        color: "#333",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default HomeScreen;