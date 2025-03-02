import React, { useState } from "react";
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator
} from "react-native";

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("http://192.168.105.101:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: name, email, password }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Đăng ký thất bại");
            }

            Alert.alert("Thành công", "Đăng ký thành công! Hãy kiểm tra email để xác minh tài khoản.");
            navigation.navigate("Login");

        } catch (error) {
            Alert.alert("Lỗi", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đăng ký</Text>

            <TextInput
                placeholder="Họ và tên"
                style={styles.input}
                value={name}
                onChangeText={setName}
            />

            <TextInput
                placeholder="Email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                placeholder="Mật khẩu"
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Đăng ký</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.link}>Đã có tài khoản? Đăng nhập</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
    input: { width: "100%", borderBottomWidth: 1, padding: 10, marginBottom: 10 },
    button: { backgroundColor: "#28a745", padding: 10, borderRadius: 5, marginTop: 10, width: "100%", alignItems: "center" },
    buttonText: { color: "#fff", fontWeight: "bold" },
    link: { marginTop: 10, color: "#007bff" },
});

export default RegisterScreen;
