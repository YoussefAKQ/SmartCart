import React, { useState } from "react";
import { StyleSheet, TextInput, Text, View, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig"; 

export default function LoginScreen({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = () => {
    if (email && password) {
      signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
        .then((userCredential) => {

          const user = userCredential.user;
          console.log("Usuario logueado:", user);
          setIsLoggedIn(true);
          navigation.replace("Home");
        })
        .catch((error) => {

          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          Alert.alert("Error", "Credenciales incorrectas. Intenta nuevamente.");
        });
    } else {
      Alert.alert("Error", "Por favor, ingresa tus credenciales.");
    }
  };

  const handleRegisterRedirect = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>SmartCart</Text>
      <Text style={styles.title}>Hola de nuevo!</Text>
      <View style={styles.inner}>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>¿No tienes cuenta?</Text>
          <TouchableOpacity onPress={handleRegisterRedirect}>
            <Text style={styles.registerLink}>Regístrate aquí</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    marginBottom: 10, 
  },
  inner: {
    padding: 20,
  },
  input: {
    height: 50,
    backgroundColor: "#fff",
    marginBottom: 20,
    paddingLeft: 15,
    color: "black",
    borderRadius: 10,
    fontSize: 15,
  },
  button: {
    backgroundColor: "#00f",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  registerContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  registerText: {
    color: "#fff",
    fontSize: 14,
  },
  registerLink: {
    color: "#00f",
    fontSize: 16,
    marginTop: 5,
  },
});
