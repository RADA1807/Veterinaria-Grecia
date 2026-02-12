import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router"; // 👈 usamos Expo Router
import { useEffect, useState } from "react";
import { FlatList, Platform, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import { API_URL } from "../constants/config";

export default function Propietarios() {
  const [propietarios, setPropietarios] = useState<any[]>([]);
  const router = useRouter(); // 👈 hook de navegación de Expo Router

  const showToast = (msg: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      console.log("Toast:", msg);
    }
  };

  const fetchPropietarios = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/propietarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      console.log("Propietarios desde backend:", data);
      setPropietarios(data);
    } catch (error) {
      console.error("❌ Error al obtener propietarios:", error);
      showToast("Error al cargar propietarios");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/propietarios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Propietario eliminado ✅");
        fetchPropietarios();
      } else {
        showToast(data.error || "Error al eliminar ❌");
      }
    } catch (error) {
      console.error("❌ Error en delete:", error);
      showToast("Error de conexión");
    }
  };

  useEffect(() => {
    fetchPropietarios();
  }, []);

  return (
    <View style={styles.container}>
      {/* 🔹 Navbar superior */}
      <View style={styles.navbar}>
        <Text style={styles.navTitle}>Veterinaria Grecia</Text>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push("/(tabs)")}>
          <Text style={styles.navButtonText}>🏠 Dashboard</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>📋 Lista de Propietarios</Text>

      {/* 🔹 Lista de propietarios */}
      <FlatList
        data={propietarios}
        keyExtractor={(item) => item.id} // ⚠️ cambia a propietario_id si tu backend usa ese campo
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.nombre}</Text>
            <Text style={styles.cardText}>📞 {item.telefono || "No registrado"}</Text>
            <Text style={styles.cardText}>📧 {item.correo || "No registrado"}</Text>
            <Text style={styles.cardText}>🏠 {item.direccion || "No registrada"}</Text>
            <Text style={styles.cardText}>🐾 Pacientes: {item.cantidad_pacientes}</Text>
            <Text style={styles.cardText}>Mascotas: {item.nombres_mascotas || "Ninguna"}</Text>

            <View style={styles.actions}>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#ffc107" }]}>
                <Text style={styles.actionText}>✏️ Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#dc3545" }]} onPress={() => handleDelete(item.id)}>
                <Text style={styles.actionText}>🗑️ Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },

  // 🔹 Navbar
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#007bff", // azul
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  navTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  navButton: {
    backgroundColor: "#0056b3", // azul más oscuro
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  navButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginVertical: 20 },
  card: { backgroundColor: "#e9ecef", padding: 15, borderRadius: 10, marginBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  cardText: { fontSize: 14, marginBottom: 3 },
  actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  actionButton: { flex: 1, paddingVertical: 8, borderRadius: 6, alignItems: "center", marginHorizontal: 5 },
  actionText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
});
