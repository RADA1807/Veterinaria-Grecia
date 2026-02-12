import { Redirect } from "expo-router";

export default function Index() {
  // ✅ Redirige automáticamente a la pantalla de bienvenida
  return <Redirect href="/bienvenida" />;
}
