import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Platform, StyleSheet, ToastAndroid, TouchableOpacity } from "react-native";

export default function Bienvenida() {
  const router = useRouter();

  useEffect(() => {
    // ✅ Mostrar Toast automático al entrar (solo Android)
    if (Platform.OS === "android") {
      ToastAndroid.show(
        "Bienvenido 👋 Accede al sistema iniciando sesión o registrándote",
        ToastAndroid.LONG
      );
    } else {
      console.log("Bienvenido 👋 - Accede al sistema iniciando sesión o registrándote");
    }
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.centerText}>
        🐾 Bienvenido a Veterinaria Grecia
      </ThemedText>
      <ThemedText type="subtitle" style={styles.centerText}>
        Para acceder al sistema debes iniciar sesión o registrarte.
      </ThemedText>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/Login")}
      >
        <ThemedText type="defaultSemiBold" style={styles.buttonText}>
          Iniciar Sesión
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#28a745" }]}
        onPress={() => router.push("/Register")}
      >
        <ThemedText type="defaultSemiBold" style={styles.buttonText}>
          Registrarse
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 20, 
    gap: 20 
  },
  centerText: {
    textAlign: "center", // ✅ Centra todo el texto
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 16, 
    textAlign: "center" // ✅ Centra el texto dentro del botón
  },
});
