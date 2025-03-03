import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, FlatList, StyleSheet, ScrollView, Dimensions } from "react-native";

const productImages = [
    require("../assets/images/bg3.jpg"),
    require("../assets/images/bg4.jpg"),
    require("../assets/images/bg5.jpg"),
    require("../assets/images/bg6.jpg"),
    require("../assets/images/bg7.jpg"),
    require("../assets/images/bg8.jpg"),
    require("../assets/images/bg9.jpg"),
    require("../assets/images/bg10.jpg"),
    require("../assets/images/bg11.jpg"),
    require("../assets/images/bg12.jpg"),
    require("../assets/images/bg13.jpg"),
    require("../assets/images/bg14.jpg"),
    require("../assets/images/bg15.jpg"),
];

const categories = ["Túi xách", "Quần", "Áo"];
const priceRanges = [
    { label: "Dưới 200K", min: 0, max: 200000 },
    { label: "200K - 400K", min: 200000, max: 400000 },
    { label: "Trên 400K", min: 400000, max: Infinity },
];

const products = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: `Sản phẩm ${i + 1}`,
    price: Math.floor(Math.random() * (500000 - 100000 + 1)) + 100000,
    image: productImages[i % productImages.length],
    category: categories[i % categories.length],
}));

const HomeScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const searchRef = useRef("");
    const [visibleProducts, setVisibleProducts] = useState(products.slice(0, 10));
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedPriceRange, setSelectedPriceRange] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);

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
        setVisibleProducts(filteredProducts.slice(0, 10));
    }, [selectedCategory, selectedPriceRange, sortOrder]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % productImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSearch = () => {
        setSearchQuery(searchRef.current);
        let filteredProducts = products.filter((p) => p.name.toLowerCase().includes(searchRef.current.toLowerCase()));
        if (selectedCategory) {
            filteredProducts = filteredProducts.filter((p) => p.category === selectedCategory);
        }
        if (selectedPriceRange) {
            filteredProducts = filteredProducts.filter(
                (p) => p.price >= selectedPriceRange.min && p.price <= selectedPriceRange.max
            );
        }
        setVisibleProducts(filteredProducts.slice(0, 10));
    };

    return (
        <FlatList
            keyboardShouldPersistTaps="handled"
            data={visibleProducts}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={() => (
                <>
                    <View style={styles.headerContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <Text style={styles.backButton}>Login</Text>
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

                    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.slideshowContainer}>
                        {productImages.map((image, index) => (
                            <Image key={index} source={image} style={styles.slideshowImage} />
                        ))}
                    </ScrollView>

                    <View style={styles.filterContainer}>
                        {categories.map((category, index) => (
                            <TouchableOpacity key={index} onPress={() => setSelectedCategory(prev => (prev === category ? null : category))}>
                                <Text style={[styles.filterText, selectedCategory === category && styles.activeFilter]}>{category}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.filterContainer}>
                        {priceRanges.map((range, index) => (
                            <TouchableOpacity key={index} onPress={() => setSelectedPriceRange(prev => (prev === range ? null : range))}>
                                <Text style={[styles.filterText, selectedPriceRange === range && styles.activeFilter]}>{range.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.filterContainer}>
                        <TouchableOpacity onPress={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                            <Text style={styles.sortButton}>{sortOrder === "asc" ? "⬆ Sắp xếp giá tăng dần" : "⬇ Sắp xếp giá giảm dần"}</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate("ProductDetail", { product: item })}>
                    <View style={styles.productCard}>
                        <Image source={item.image} style={styles.productImage} />
                        <Text style={styles.productText}>{item.name} - {item.price} VND</Text>
                    </View>
                </TouchableOpacity>
            )}

        />
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        paddingTop: 50,
        backgroundColor: "#f8f8f8",
    },
    backButton: {
        fontSize: 16,
        color: "blue",
    },
    searchInput: {
        flex: 1,
        marginHorizontal: 10,
        padding: 8,
        borderWidth: 1,
        borderColor: "green",
        borderRadius: 5,
    },
    searchButton: {
        fontSize: 16,
        color: "blue",
    },
    slideshowContainer: {
        marginVertical: 10,
    },
    slideshowImage: {
        width: Dimensions.get("window").width * 0.9,
        height: 150,
        marginHorizontal: 5,
        borderRadius: 10,
    },
    filterContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        elevation: 2,
        marginBottom: 10,
    },
    filterText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
    },
    activeFilter: {
        color: "red",
    },
    productCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#34C759",
        marginVertical: 5,
        padding: 15,
        borderRadius: 10,
        elevation: 2,
    },
    productImage: {
        width: 60,
        height: 60,
        marginRight: 15,
        borderRadius: 10,
    },
    productText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default HomeScreen;
