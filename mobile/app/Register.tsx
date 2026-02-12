import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const showToast = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      console.log("Toast:", message); // en iOS/web solo log
    }
  };

  const handleRegister = async () => {
    if (!nombre || !email || !telefono || !password) {
      showToast("Campos incompletos ❌ Por favor completa todos los campos");
      return;
    }

    try {
      const response = await fetch("http://192.168.0.178:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, telefono, password }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Registro exitoso ✅ Ya puedes iniciar sesión");

        // Guardar datos si el backend devuelve token
        if (data.token) {
          await AsyncStorage.setItem("token", data.token);
          await AsyncStorage.setItem("nombre", nombre);
          await AsyncStorage.setItem("email", email);
          await AsyncStorage.setItem("telefono", telefono);
        }

        // ✅ Redirigir al login
        router.replace("/Login");
      } else {
        showToast("Error en el registro ❌ " + (data.error || "Intenta nuevamente"));
      }
    } catch (error) {
      console.error("❌ Error en registro:", error);
      showToast("Error de conexión ❌ No se pudo conectar con el servidor");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta 📝</Text>
      <Text style={styles.subtitle}>Regístrate para continuar</Text>

      <TextInput
        placeholder="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />
      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Teléfono"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      {/* ✅ Enlace para ir al login */}
      <TouchableOpacity onPress={() => router.push("/Login")}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión aquí</Text>
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
    backgroundColor: "#28a745",
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
