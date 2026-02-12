import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from "react-native";

export default function Dashboard() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const storedNombre = await AsyncStorage.getItem("nombre");
      if (storedNombre) setNombre(storedNombre);
    };
    loadData();
  }, []);

  const showToast = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      console.log("Toast:", message); // en iOS/web solo log
    }
  };

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        await fetch("http://192.168.0.178:3001/api/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // ✅ Limpiar sesión
      await AsyncStorage.multiRemove(["token", "nombre", "email", "telefono"]);

      showToast("Sesión cerrada ✅");

      // ✅ Redirigir a Bienvenida
      router.replace("/bienvenida");
    } catch (error) {
      console.error("❌ Error en logout:", error);
      showToast("Error al cerrar sesión");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Veterinaria Grecia</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Bienvenid@{nombre ? ` ${nombre}` : ""} 👋
        </Text>
        <Text style={styles.text}>
          Este es tu panel principal. Desde aquí puedes acceder a los módulos del sistema.
        </Text>

        <View style={styles.grid}>
          <TouchableOpacity
            style={[styles.card, { backgroundColor: "#cce5ff" }]}
            onPress={() => router.push("/profile")}
          >
            <Text style={styles.icon}>👤</Text>
            <Text style={styles.cardText}>Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, { backgroundColor: "#d4edda" }]}
            onPress={() => router.push("/propietarios")}
          >
            <Text style={styles.icon}>📋</Text>
            <Text style={styles.cardText}>Propietarios</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, { backgroundColor: "#fff3cd" }]}
            onPress={() => router.push("/pacientes")}
          >
            <Text style={styles.icon}>🐾</Text>
            <Text style={styles.cardText}>Pacientes</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    backgroundColor: "#007bff",
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
  },
  content: { flex: 1, padding: 20, justifyContent: "space-between" },
  subtitle: { fontSize: 18, textAlign: "center", marginBottom: 10 },
  text: { fontSize: 14, textAlign: "center", color: "#6c757d", marginBottom: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around" },
  card: {
    width: "40%",
    padding: 25,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: { fontSize: 32, marginBottom: 10 },
  cardText: { fontSize: 16, fontWeight: "600", color: "#343a40", textAlign: "center", flexShrink: 1 },
  footer: { marginTop: 40, alignItems: "center" },
  logoutButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
