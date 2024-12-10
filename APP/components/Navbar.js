import React from "react";
import { StyleSheet, Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const Navbar = () => {
  const navigation = useNavigation();
  const route = useRoute();
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={{ alignItems: 'center' }} 
      style={styles.navbar}
    >
      <TouchableOpacity 
        style={[styles.navButton, route.name === "ProfileScreen" ? styles.navButtonActive : null]} 
        onPress={() => navigation.navigate("ProfileScreen")}
      >
        <Text style={[styles.navButtonText, route.name === "ProfileScreen" ? styles.navButtonActiveText : null]}>
          Perfil
        </Text> 
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.navButton, route.name === "Home" ? styles.navButtonActive : null]} 
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={[styles.navButtonText, route.name === "Home" ? styles.navButtonActiveText : null]}>
          Home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.navButton, route.name === "RecipesScreen" ? styles.navButtonActive : null]} 
        onPress={() => navigation.navigate("RecipesScreen")}
      >
        <Text style={[styles.navButtonText, route.name === "RecipesScreen" ? styles.navButtonActiveText : null]}>
          Recetas
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.navButton, route.name === "ProductScreen" ? styles.navButtonActive : null]} 
        onPress={() => navigation.navigate("ProductScreen")}
      >
        <Text style={[styles.navButtonText, route.name === "ProductScreen" ? styles.navButtonActiveText : null]}>
          Productos
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.navButton, route.name === "ListScreen" ? styles.navButtonActive : null]} 
        onPress={() => navigation.navigate("ListScreen")}
      >
        <Text style={[styles.navButtonText, route.name === "ListScreen" ? styles.navButtonActiveText : null]}>
          Listas
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    marginVertical: 10,
  },
  navButton: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#333",
    marginRight: 5,
    flexShrink: 1,
  },
  navButtonActive: {
    backgroundColor: "#fff",
  },
  navButtonText: {
    fontSize: 18,
    color: "#fff",
  },
  navButtonActiveText: {
    color: "#000",
  },
});

export default Navbar;
