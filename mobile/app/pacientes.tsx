import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

export default function Pacientes() {
  const router = useRouter();
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [propietarios, setPropietarios] = useState<any[]>([]);

  const showToast = (msg: string) => {
    if (Platform.OS === "android") ToastAndroid.show(msg, ToastAndroid.SHORT);
    else console.log("Toast:", msg);
  };

  const fetchPacientes = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch("http://192.168.0.178:3001/api/pacientes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setPacientes(data);
    } catch {
      showToast("Error al cargar pacientes");
    }
  };

  const fetchPropietarios = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch("http://192.168.0.178:3001/api/propietarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setPropietarios(data);
    } catch {
      showToast("Error al cargar propietarios");
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar eliminación", "¿Seguro que deseas eliminar este paciente?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            const response = await fetch(
              `http://192.168.0.178:3001/api/pacientes/${id}`,
              { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.ok) {
              showToast("Paciente eliminado ✅");
              fetchPacientes();
            } else showToast("Error al eliminar ❌");
          } catch {
            showToast("Error de conexión");
          }
        },
      },
    ]);
  };

  const handleEdit = (id: string) => {
    router.push(`/pacientes/edit/${id}`);
  };

  const handleRegister = () => {
    router.push("/pacientes/register");
  };

  useEffect(() => {
    fetchPacientes();
    fetchPropietarios();
  }, []);

  const getPropietarioNombre = (propietarioId: string) => {
    const propietario = propietarios.find((p) => p.id === propietarioId);
    return propietario ? propietario.nombre : "Desconocido";
  };

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.navTitle}>🐾 Pacientes</Text>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={styles.navButtonText}>🏠 Dashboard</Text>
        </TouchableOpacity>
      </View>

      {/* Botón para registrar nuevo paciente */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#28a745" }]}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>➕ Registrar Paciente</Text>
      </TouchableOpacity>

      {/* Lista */}
      <FlatList
        data={pacientes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.nombre}</Text>
            <Text style={styles.cardText}>🐕 Especie: {item.especie}</Text>
            <Text style={styles.cardText}>🐾 Raza: {item.raza}</Text>
            <Text style={styles.cardText}>🎂 Edad: {item.edad}</Text>
            <Text style={styles.cardText}>📋 Historial: {item.historial_medico}</Text>
            <Text style={styles.cardText}>
              👤 Propietario: {getPropietarioNombre(item.propietario_id)}
            </Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#ffc107" }]}
                onPress={() => handleEdit(item.id)}
              >
                <Text style={styles.actionText}>✏️ Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#dc3545" }]}
                onPress={() => handleDelete(item.id)}
              >
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
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  navTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  navButton: {
    backgroundColor: "#0056b3",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  navButtonText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  card: {
    backgroundColor: "#e9ecef",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 6 },
  cardText: { fontSize: 14, marginBottom: 4 },
  actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 4,
  },
  actionText: { color: "#fff", fontSize: 14, fontWeight: "600" },
});