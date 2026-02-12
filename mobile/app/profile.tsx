import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";

export default function Profile() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const storedNombre = await AsyncStorage.getItem("nombre");
      const storedEmail = await AsyncStorage.getItem("email");
      const storedTelefono = await AsyncStorage.getItem("telefono");

      if (storedNombre) setNombre(storedNombre);
      if (storedEmail) setEmail(storedEmail);
      if (storedTelefono) setTelefono(storedTelefono);
    };
    loadData();
  }, []);

  const showToast = (msg: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      console.log("Toast:", msg);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return showToast("No hay sesión activa");

      const response = await fetch("http://192.168.0.178:3001/api/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre, email, telefono }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("nombre", nombre);
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("telefono", telefono);

        showToast("Perfil actualizado ✅");
        router.replace("/(tabs)");
      } else {
        showToast(data.error || "Error al actualizar ❌");
      }
    } catch (error) {
      console.error("❌ Error en update:", error);
      showToast("Error de conexión");
    }
  };

  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return showToast("No hay sesión activa");

      const response = await fetch("http://192.168.0.178:3001/api/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Cuenta eliminada ✅");
        await AsyncStorage.clear();
        router.replace("/bienvenida");
      } else {
        showToast(data.error || "Error al eliminar ❌");
      }
    } catch (error) {
      console.error("❌ Error en delete:", error);
      showToast("Error de conexión");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>👤 Perfil de Usuario</Text>
      </View>

      <View style={styles.content}>
        <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Nombre" />
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" />
        <TextInput style={styles.input} value={telefono} onChangeText={setTelefono} placeholder="Teléfono" />

        <TouchableOpacity style={[styles.card, { backgroundColor: "#cce5ff" }]} onPress={handleUpdate}>
          <Text style={styles.icon}>💾</Text>
          <Text style={styles.cardText}>Actualizar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: "#f8d7da" }]} onPress={handleDelete}>
          <Text style={styles.icon}>🗑️</Text>
          <Text style={styles.cardText}>Eliminar Cuenta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    backgroundColor: "#007bff",
    paddingVertical: 20,
    alignItems: "center",
  },
  headerText: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  content: { flex: 1, padding: 20, justifyContent: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  card: {
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: { fontSize: 28, marginBottom: 8 },
  cardText: { fontSize: 16, fontWeight: "600", color: "#343a40", textAlign: "center" },
});
