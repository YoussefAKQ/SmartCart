import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from "react-native";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUser(currentUser);
    } else {
      Alert.alert("No has iniciado sesión", "Por favor, inicia sesión para ver tu perfil.");
      navigation.replace("Login");
    }

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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setProfileImage(uri);
      await AsyncStorage.setItem("profileImage", uri);
    }
  };

  const handleLogout = () => {
    const auth = getAuth();
    auth.signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => {
        console.log("Error al cerrar sesión:", error.message);
      });
  };

  const handleGoBack = () => {
    navigation.goBack(); 
  };

  const handlePasswordReset = () => {
    const auth = getAuth();
    if (user) {
      sendPasswordResetEmail(auth, user.email)
        .then(() => {
          Alert.alert(
            "Correo enviado",
            "Se ha enviado un correo para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada."
          );
        })
        .catch((error) => {
          console.log("Error al enviar correo de restablecimiento:", error.message);
          Alert.alert(
            "Error",
            "No se pudo enviar el correo de restablecimiento. Inténtalo más tarde."
          );
        });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>SmartCart</Text>
      <Text style={styles.title}>Perfil del Usuario</Text>

      {user ? (
        <View style={styles.userInfo}>
          <Text style={styles.infoText}>Nombre: {user.displayName || "No disponible"}</Text>
          <Text style={styles.infoText}>Correo electrónico: {user.email}</Text>
          <Text style={styles.infoText}>UID: {user.uid}</Text>
        </View>
      ) : (
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      )}

      <TouchableOpacity onPress={pickImage}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Selecciona una foto</Text>
          </View>
        )}
      </TouchableOpacity>
      <Text style={styles.instructions}>
        Toca la imagen para seleccionar una nueva foto de perfil
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>Cambiar contraseña</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.goBackButton]} onPress={handleGoBack}>
        <Text style={styles.buttonText}>Volver a la pantalla de inicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    fontSize: 52,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
  },
  title: {
    fontSize: 32,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  userInfo: {
    marginBottom: 30,
  },
  infoText: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#00f",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  resetButton: {
    backgroundColor: "#f90", 
  },
  goBackButton: {
    backgroundColor: "#555",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
    marginLeft: 125
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  placeholderText: {
    color: "#888",
  },
  instructions: {
    marginTop: 10,
    color: "#fff",
    marginBottom: 140
  },
});
