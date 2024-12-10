import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import Navbar from "../components/Navbar";
import { useNavigation } from '@react-navigation/native';

export default function SavedListsScreen({ lists, addList, deleteList }) {
  const navigation = useNavigation();
  const [newListTitle, setNewListTitle] = useState("");

  const handleAddList = () => {
    if (!newListTitle.trim()) {
      Alert.alert("Error", "El nombre de la lista no puede estar vacío.");
      return;
    }
    const newList = {
      id: Date.now(),
      title: newListTitle,
      productCount: 0,
      products: [],
    };
    addList(newList);
    setNewListTitle(""); 
  };

  const navigateToListDetail = (list) => {
    navigation.navigate('ListDetailScreen', { list });
  };

  const handleDeleteList = (id) => {
    Alert.alert(
      "Eliminar Lista",
      "¿Estás seguro de que quieres eliminar esta lista?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => deleteList(id) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1, marginTop: 40 }}>
        <View style={styles.header}>
          <Text style={styles.logo}>SmartCart</Text>
        </View>
        <Text style={styles.subtitle}>Estas son tus listas guardadas</Text>
        <Navbar />
        <ScrollView contentContainerStyle={styles.listsContainer}>
          {lists.map((list) => (
            <TouchableOpacity
              key={list.id}
              style={styles.listCard}
              onPress={() => navigateToListDetail(list)}
              onLongPress={() => handleDeleteList(list.id)}
            >
              <Text style={styles.listTitle}>{list.title}</Text>
              <Text style={styles.productCount}>
                {list.productCount} PRODUCTOS
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nueva lista"
            placeholderTextColor="#888"
            value={newListTitle}
            onChangeText={setNewListTitle}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddList}>
            <Text style={styles.addButtonText}>Añadir</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.footer}>
          Desarrollado por Youssef {"\n"}Todos los derechos reservados © 2024
        </Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 52,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    marginVertical: 20,
  },
  listsContainer: {
    marginTop: 0,
    paddingHorizontal: 10,
  },
  listCard: {
    backgroundColor: "#00f",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  listTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  productCount: {
    fontSize: 18,
    color: "#fff",
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "#222",
    color: "#fff",
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#00f",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  footer: {
    textAlign: "center",
    color: "#fff",
    fontSize: 12,
    marginTop: 20,
  },
});