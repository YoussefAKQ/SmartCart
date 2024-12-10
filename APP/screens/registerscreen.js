import React, { useState } from "react";
import { Alert, StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    if (!username.includes("@") || !username.includes(".")) {
      Alert.alert("Error", "Por favor, ingresa un correo electrónico válido");
      return;
    }

    createUserWithEmailAndPassword(FIREBASE_AUTH, username, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Usuario registrado:", user);
        Alert.alert("Éxito", "Usuario registrado con éxito");
        navigation.navigate("Login");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        Alert.alert("Error", "La contraseña ha de tener mínimo de 6 caracteres");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>SmartCart</Text>
      <Text style={styles.greeting}>Crear cuenta</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#ccc"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Contraseña"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerText}>Registrarse</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.backText}>Ya tengo cuenta. Iniciar sesión</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Desarrollado por Youssef {"\n"}Todos los derechos reservados © 2024
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 10, justifyContent: "flex-start", paddingTop: 150 },
  logo: { fontSize: 52, fontWeight: "bold", color: "#fff", textAlign: "center" },
  greeting: { fontSize: 34, color: "#fff", marginTop: 0, marginBottom: 20, textAlign: "center" },
  formContainer: { marginHorizontal: 20 },
  input: {
    backgroundColor: "#fff",
    color: "black",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 15,
  },
  registerButton: {
    backgroundColor: "#00f",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  registerText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
  footer: { textAlign: "center", color: "#fff", fontSize: 12, marginTop: 40 },
  backButton: {
    marginTop: 20,
    alignItems: "center",
  },
  backText: {
    fontSize: 16,
    color: "#00f",
  },
});
