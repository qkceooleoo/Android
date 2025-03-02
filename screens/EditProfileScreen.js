import React, { useState } from "react";
import { View, Text, TextInput, Button, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export default function EditProfileScreen() {
    const [name, setName] = useState("Nguyễn Văn A");
    const [email, setEmail] = useState("user@example.com");
    const [phone, setPhone] = useState("0123456789");
    const [otp, setOtp] = useState("");
    const [image, setImage] = useState(null);

    // 🔹 Chọn ảnh từ thư viện
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    // 🔹 Upload ảnh lên Cloudinary
    const uploadImage = async () => {
        if (!image) {
            Alert.alert("Vui lòng chọn ảnh!");
            return;
        }

        let formData = new FormData();
        formData.append("file", { uri: image, type: "image/jpeg", name: "profile.jpg" });
        formData.append("upload_preset", "your_upload_preset"); // Thay bằng upload_preset từ Cloudinary

        try {
            let res = await axios.post("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", formData);
            Alert.alert("Ảnh đã được cập nhật!");
            return res.data.secure_url;
        } catch (error) {
            Alert.alert("Lỗi khi tải ảnh lên!");
        }
    };

    // 🔹 Gửi OTP xác nhận email
    const sendOtp = async () => {
        try {
            let res = await axios.post("https://your-api.com/send-otp", { email });
            Alert.alert("Mã OTP đã được gửi!");
        } catch (error) {
            Alert.alert("Lỗi khi gửi OTP!");
        }
    };

    // 🔹 Xác thực OTP và cập nhật thông tin
    const updateProfile = async () => {
        let imageUrl = await uploadImage();

        try {
            let res = await axios.put("https://your-api.com/update-profile", {
                name,
                email,
                phone,
                otp,
                image: imageUrl,
            });

            Alert.alert("Cập nhật thành công!");
        } catch (error) {
            Alert.alert("Lỗi khi cập nhật!");
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text>Họ và Tên:</Text>
            <TextInput value={name} onChangeText={setName} style={{ borderWidth: 1, padding: 10, marginBottom: 10 }} />

            <Text>Email:</Text>
            <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" style={{ borderWidth: 1, padding: 10, marginBottom: 10 }} />
            <Button title="Gửi OTP" onPress={sendOtp} />

            <Text>Nhập mã OTP:</Text>
            <TextInput value={otp} onChangeText={setOtp} keyboardType="numeric" style={{ borderWidth: 1, padding: 10, marginBottom: 10 }} />

            <Text>Điện thoại:</Text>
            <TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={{ borderWidth: 1, padding: 10, marginBottom: 10 }} />

            <Text>Ảnh đại diện:</Text>
            <Button title="Chọn ảnh" onPress={pickImage} />
            {image && <Image source={{ uri: image }} style={{ width: 100, height: 100, marginTop: 10 }} />}

            <Button title="Cập nhật hồ sơ" onPress={updateProfile} />
        </View>
    );
}
