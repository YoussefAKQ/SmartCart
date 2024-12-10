import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet, Image, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileButton() {
  const [profileImage, setProfileImage] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const savedImage = await AsyncStorage.getItem("profileImage");
        if (savedImage) {
          setProfileImage(savedImage);
        }
      } catch (error) {
        console.error("Error loading profile image:", error);
      }
    };

    loadProfileImage();
  }, []);

  const handlePress = () => {
    navigation.navigate("ProfileScreen");
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      {profileImage ? (
        <Image source={{ uri: profileImage }} style={styles.icon} />
      ) : (
        <Image
          source={require("../assets/iconoperfil.png")} 
          style={styles.icon} 
          resizeMode="contain"
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 18,
    right: 20,
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
