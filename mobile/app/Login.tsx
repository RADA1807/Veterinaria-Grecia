import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const showToast = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      console.log("Toast:", message); // en iOS/web solo log
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showToast("Campos incompletos ❌ Por favor ingresa correo y contraseña");
      return;
    }

    try {
      const response = await fetch("http://192.168.0.178:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // ✅ Guardar token y nombre en AsyncStorage
        await AsyncStorage.setItem("token", data.token);

        if (data.nombre) {
          await AsyncStorage.setItem("nombre", data.nombre);
        } else {
          console.warn("⚠️ El backend no devolvió 'nombre'");
        }

        showToast("Login exitoso ✅ Bienvenido " + (data.nombre || ""));

        console.log("Token recibido:", data.token);

        // ✅ Navegar al dashboard
        router.replace("/(tabs)");
      } else {
        showToast("Credenciales inválidas ❌ " + (data.error || "Verifica tu correo y contraseña"));
      }
    } catch (error) {
      console.error("❌ Error en login:", error);
      showToast("Error de conexión ❌ No se pudo conectar con el servidor");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido 👋</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>

      {/* ✅ Enlace para ir al registro */}
      <TouchableOpacity onPress={() => router.push("/Register")}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate aquí</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007bff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    color: "#007bff",
    marginTop: 15,
    fontSize: 16,
  },
});
