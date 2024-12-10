import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { predefinedRecipes } from "../predefinesRecipes";

const normalizeString = (str) => {
  return str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
};

const RecipesScreen = ({ route, lists }) => {
  const [recipes, setRecipes] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const generateRecipes = () => {
      const allProducts = lists.flatMap(list => list.products.map(product => normalizeString(product.name.split(' ')[0])));
      const matchedRecipes = predefinedRecipes.filter(recipe =>
        recipe.ingredients.every(ingredient =>
          allProducts.includes(normalizeString(ingredient))
        )
      );
      setRecipes(matchedRecipes);
    };

    generateRecipes();
  }, [lists]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recetas Basadas en tus Listas</Text>
      <FlatList
        data={recipes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.recipeContainer}>
            <Text style={styles.recipeName}>{item.name}</Text>
            <Text style={styles.recipeIngredients}>Ingredientes: {item.ingredients.join(', ')}</Text>
            <Text style={styles.recipeDescription}>{item.description}</Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
    paddingTop: 70,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  recipeContainer: {
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  recipeName: {
    fontSize: 18,
    color: "#fff",
  },
  recipeIngredients: {
    fontSize: 16,
    color: "#bbb",
  },
  recipeDescription: {
    fontSize: 14,
    color: "#888",
  },
  backButton: {
    backgroundColor: "#00f",
    padding: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 20,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default RecipesScreen;
