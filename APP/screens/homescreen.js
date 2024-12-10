import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import Navbar from "../components/Navbar";
import Profile from "../components/Profile";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const [totalSavings, setTotalSavings] = useState(0);
  const [totalLists, setTotalLists] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const savings = await AsyncStorage.getItem("totalSavings");
        setTotalSavings(savings ? parseFloat(savings) : 0);

        const lists = await AsyncStorage.getItem("lists");
        if (lists) {
          const parsedLists = JSON.parse(lists);
          setTotalLists(parsedLists.length);

          const totalSpentAmount = parsedLists.reduce((total, list) => {
            return total + list.products.reduce((sum, product) => sum + product.price, 0);
          }, 0);
          setTotalSpent(totalSpentAmount);
        } else {
          setTotalLists(0);
          setTotalSpent(0);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 1000); 

    return () => clearInterval(interval); 
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1, marginTop: 40 }}>
        <View style={styles.header}>
          <Text style={styles.logo}>SmartCart</Text>
          <Profile />
        </View>
        <Text style={styles.greeting}>Hola!</Text>
        <Navbar />
        <View style={styles.cardsContainer}>
          <View style={styles.bigCard}>
            <Text style={styles.cardTitle}>Mis Listas De Productos</Text>
            <Text style={styles.cardSubtitle}>{totalLists} Listas</Text>
            <Text style={styles.arrow}>↗</Text>
          </View>
          <View style={styles.smallCardContainer}>
            <View style={styles.smallCard}>
              <Text style={styles.cardTitle2}>Total Ahorro</Text>
              <Text style={styles.cardValue2}>{`${totalSavings.toFixed(2)}€`}</Text>
            </View>
            <View style={[styles.smallCard, styles.smallCardBlue]}>
              <Text style={styles.cardTitle3}>Total Gasto</Text>
              <Text style={styles.cardValue3}>{`${totalSpent.toFixed(2)}€`}</Text>
            </View>
          </View>
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: 52,
    fontWeight: "bold",
    color: "#fff",
  },
  greeting: {
    fontSize: 34,
    color: "#fff",
    marginTop: 0,
    marginBottom: 50,
  },
  cardsContainer: {
    marginVertical: 20,
  },
  bigCard: {
    backgroundColor: "#00f",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    position: "relative",
  },
  cardTitle: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#fff",
  },
  cardSubtitle: {
    fontSize: 35,
    color: "#fff",
    marginVertical: 10,
  },
  arrow: {
    position: "absolute",
    top: 20,
    right: 20,
    fontSize: 24,
    color: "#fff",
  },
  smallCardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  smallCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 5,
  },
  smallCardBlue: {
    backgroundColor: "#00f",
  },
  cardTitle2: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
  },
  cardValue2: {
    fontSize: 30,
    color: "#000",
    marginTop: 25,
  },
  cardTitle3: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
  },
  cardValue3: {
    fontSize: 30,
    color: "#fff",
    marginTop: 25,
  },
  footer: {
    textAlign: "center",
    color: "#fff",
    fontSize: 12,
    marginTop: 80,
  },
});
