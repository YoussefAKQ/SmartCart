import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ListDetailScreen({ route, lists, addProductToList, deleteProductFromList }) {
  const { list } = route.params;
  const [products, setProducts] = useState(list.products);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const currentList = lists.find(l => l.id === list.id);
    if (currentList) {
      setProducts(currentList.products);
    }
  }, [lists, list]);

  const updateLastModified = async () => {
    try {
      await AsyncStorage.setItem("lastUpdate", Date.now().toString());
    } catch (error) {
      console.error("Error updating last modified:", error);
    }
  };

  const addProduct = () => {
    if (!newProductName.trim() || !newProductPrice.trim()) {
      alert("El nombre y el precio del producto no pueden estar vacíos.");
      return;
    }
    if (isNaN(newProductPrice)) {
      alert("El precio debe ser un número válido.");
      return;
    }

    const newProduct = { name: newProductName, price: parseFloat(newProductPrice) };
    setProducts((prevProducts) => [...prevProducts, newProduct]);
    addProductToList(list.id, newProduct);

    setNewProductName("");
    setNewProductPrice("");
    updateLastModified();
  };

  const deleteProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
    deleteProductFromList(list.id, updatedProducts);
    updateLastModified();
  };

  const calculateTotalPrice = () => {
    return products.reduce((total, product) => total + (product.price || 0), 0).toFixed(2);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{list.title}</Text>
      <FlatList
        data={products}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.productContainer}>
            <Text style={styles.productText}>
              {item.name} - {(typeof item.price === 'number') ? item.price.toFixed(2) : "0.00"}€
            </Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteProduct(index)}
            >
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay productos en esta lista.</Text>
        }
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: {calculateTotalPrice()} €</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nombre del producto"
          placeholderTextColor="#888"
          value={newProductName}
          onChangeText={setNewProductName}
        />
        <TextInput
          style={styles.input}
          placeholder="Precio"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={newProductPrice}
          onChangeText={setNewProductPrice}
        />
        <TouchableOpacity style={styles.addButton} onPress={addProduct}>
          <Text style={styles.addButtonText}>Añadir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  backButton: {
    backgroundColor: "#00f",
    padding: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  productContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#222",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  productText: {
    color: "#fff",
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: "#f00",
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyText: {
    color: "#888",
    textAlign: "center",
    marginVertical: 20,
  },
  totalContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 24,
    color: "#fff",
  },
  inputContainer: {
    marginTop: 20,
  },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: "#00f",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
