import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Alert } from "react-native";
import Navbar from "../components/Navbar";
import { useNavigation } from "@react-navigation/native";
import debounce from "lodash.debounce";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProductScreen({ lists }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigation = useNavigation();

  const fetchProducts = debounce(async (term) => {
    if (term) {
      try {
        const response = await fetch(
          `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${term}&json=true`
        );
        const data = await response.json();

        const productsWithPrice = data.products.map(product => ({
          ...product,
          price: product.price ? parseFloat(product.price) : parseFloat((Math.random() * (10 - 1) + 1).toFixed(2))
        }));

        setProducts(productsWithPrice || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    } else {
      setProducts([]);
    }
  }, 1000);

  useEffect(() => {
    fetchProducts(searchTerm);
    return () => {
      fetchProducts.cancel();
    };
  }, [searchTerm]);

  const normalizeString = (str) => {
    return str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
  };

  const getFirstWord = (str) => {
    return str ? str.split(" ")[0] : "";
  };

  const filteredProducts = products.filter((product) =>
    normalizeString(getFirstWord(product.product_name)).includes(normalizeString(getFirstWord(searchTerm)))
  );

  const updateSavings = async (difference) => {
    try {
      const currentSavings = await AsyncStorage.getItem("totalSavings");
      const updatedSavings = currentSavings ? parseFloat(currentSavings) + difference : difference;
      await AsyncStorage.setItem("totalSavings", updatedSavings.toString());
      await AsyncStorage.setItem("lastUpdate", Date.now().toString());
    } catch (error) {
      console.error("Error updating savings:", error);
    }
  };

  const handleSelectProduct = (product) => {
    const similarProducts = products.filter(
      (item) => getFirstWord(normalizeString(item.product_name)) === getFirstWord(normalizeString(product.product_name)) && item.price < product.price
    );

    const randomChance = Math.random();
    if (similarProducts.length > 0 && randomChance <= 0.5) {
      const cheaperProduct = similarProducts[0];
      Alert.alert(
        "Producto más barato encontrado",
        `Hay un producto similar más barato: "${cheaperProduct.product_name}" por ${cheaperProduct.price} €. ¿Te gustaría agregarlo en lugar del original?`,
        [
          {
            text: "Sí",
            onPress: () => {
              const difference = product.price - cheaperProduct.price;
              updateSavings(difference);
              const newProduct = {
                name: cheaperProduct.product_name,
                price: cheaperProduct.price,
              };
              setSelectedProducts((prevState) => [...prevState, newProduct]);
              navigation.navigate('SelectListScreen', { product: newProduct });
            }
          },
          {
            text: "No",
            onPress: () => {
              const newProduct = {
                name: product.product_name,
                price: product.price,
              };
              setSelectedProducts((prevState) => [...prevState, newProduct]);
              navigation.navigate('SelectListScreen', { product: newProduct });
            }
          }
        ]
      );
    } else {
      const newProduct = {
        name: product.product_name,
        price: product.price,
      };
      setSelectedProducts((prevState) => [...prevState, newProduct]);
      navigation.navigate('SelectListScreen', { product: newProduct });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1, marginTop: 40 }}>
        <View style={styles.header}>
          <Text style={styles.logo}>SmartCart</Text>
        </View>
        <Text style={styles.subtitle}>Estos son los productos</Text>
        <Navbar />
        <TextInput
          style={styles.searchBar}
          placeholder="Busca tu producto"
          placeholderTextColor="#888"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <ScrollView contentContainerStyle={styles.productsContainer}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <TouchableOpacity
                key={product.code}
                style={styles.productCard}
                onPress={() => handleSelectProduct(product)}
              >
                <Text style={styles.productTitle}>{product.product_name}</Text>
                <Text style={styles.productDetails}>
                  {product.ingredients_text || "Ingredientes no disponibles"}
                </Text>
                <Text style={styles.productPrice}>
                  {`${product.price} €`}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noProducts}>Introduce el producto que quieres añadir.</Text>
          )}
        </ScrollView>
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
  searchBar: {
    backgroundColor: "#333",
    color: "#fff",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  productsContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20, 
  },
  productCard: {
    backgroundColor: "#00f",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  productDetails: {
    fontSize: 18,
    color: "#fff",
    marginTop: 10,
  },
  productPrice: {
    fontSize: 18,
    color: "#fff",
    marginTop: 10,
  },
  noProducts: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
  footer: {
    textAlign: "center",
    color: "#fff",
    fontSize: 12,
    marginTop: 20,
  },
});
