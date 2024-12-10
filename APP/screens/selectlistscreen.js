import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function SelectListScreen({ lists, addProductToList }) {
  const navigation = useNavigation();
  const route = useRoute();
  const { product } = route.params;

  const handleSelectList = (listId) => {
    addProductToList(listId, product);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona una Lista</Text>
      {lists.map((list) => (
        <TouchableOpacity
          key={list.id}
          style={styles.listCard}
          onPress={() => handleSelectList(list.id)}
        >
          <Text style={styles.listTitle}>{list.title}</Text>
          <Text style={styles.productCount}>
            {list.productCount} PRODUCTOS
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  listCard: {
    backgroundColor: "#00f",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  listTitle: {
    fontSize: 18,
    color: "#fff",
  },
  productCount: {
    fontSize: 14,
    color: "#fff",
    marginTop: 5,
  },
});