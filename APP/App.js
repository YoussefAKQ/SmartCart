import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import HomeScreen from "./screens/homescreen";
import LoginScreen from "./screens/loginscreen";
import RegisterScreen from "./screens/registerscreen"; 
import ListScreen from "./screens/listscreen";
import ProductScreen from './screens/productscreen';
import ProfileScreen from "./screens/profilescreen";
import ListDetailScreen from "./screens/listdetailscreen";
import SelectListScreen from "./screens/selectlistscreen";
import RecipesScreen from "./screens/recipesscreen"; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const loadLists = async () => {
      try {
        const savedLists = await AsyncStorage.getItem('lists');
        if (savedLists !== null) {
          setLists(JSON.parse(savedLists));
        }
      } catch (error) {
        console.error("Failed to load lists:", error);
      }
    };

    loadLists();
  }, []);

  const saveLists = async (newLists) => {
    try {
      await AsyncStorage.setItem('lists', JSON.stringify(newLists));
      setLists(newLists);
    } catch (error) {
      console.error("Failed to save lists:", error);
    }
  };

  const addList = (list) => {
    const newLists = [...lists, list];
    saveLists(newLists);
  };

  const deleteList = (id) => {
    const newLists = lists.filter((list) => list.id !== id);
    saveLists(newLists);
  };

  const addProductToList = (listId, product) => {
    const newLists = lists.map((list) =>
      list.id === listId
        ? {
            ...list,
            products: [...list.products, product],
            productCount: list.products.length + 1,
          }
        : list
    );
    saveLists(newLists);
  };

  const deleteProductFromList = (listId, updatedProducts) => {
    const newLists = lists.map((list) =>
      list.id === listId
        ? {
            ...list,
            products: updatedProducts,
            productCount: updatedProducts.length,
          }
        : list
    );
    saveLists(newLists);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={isLoggedIn ? "Home" : "Login"}
        screenOptions={{ 
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter
        }} 
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login">
          {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
        </Stack.Screen>
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ListScreen">
          {(props) => <ListScreen {...props} lists={lists} addList={addList} deleteList={deleteList} />}
        </Stack.Screen>
        <Stack.Screen name="ProductScreen">
          {(props) => <ProductScreen {...props} lists={lists} />}
        </Stack.Screen>
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="ListDetailScreen">
          {(props) => <ListDetailScreen {...props} lists={lists} addProductToList={addProductToList} deleteProductFromList={deleteProductFromList} />}
        </Stack.Screen>
        <Stack.Screen name="SelectListScreen">
          {(props) => <SelectListScreen {...props} lists={lists} addProductToList={addProductToList} />}
        </Stack.Screen>
        <Stack.Screen name="RecipesScreen">
          {(props) => <RecipesScreen {...props} lists={lists} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
