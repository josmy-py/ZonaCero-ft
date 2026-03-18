// ============================================
// ⚠️ IMPORTANTE: Configura Firebase antes de usar
// ============================================
// Para configurar Firebase:
// 1. Crea un proyecto en https://console.firebase.google.com
// 2. Habilita "Authentication" > "Google" como proveedor
// 3. Copia la configuración de tu proyecto y reemplaza los valores abajo
// 4. En desarrollo, agrega "localhost" a los dominios autorizados

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

// Configuración de Firebase - REEMPLAZA CON TUS PROPIOS VALORES
const firebaseConfig = {
  apiKey: "TU_API_KEY",           // → Obtén en: Configuración del proyecto > Claves API
  authDomain: "tu-proyecto.firebaseapp.com",  // → Proyecto ID + firebaseapp.com
  projectId: "tu-proyecto",       // → ID del proyecto en Firebase Console
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",  // → Número de proyecto
  appId: "TU_APP_ID"             // → Obtén en: Configuración del proyecto > General
};

// ============================================
// Fin de configuración de Firebase
// ============================================

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Función para iniciar sesión con Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error al iniciar sesión con Google:", error);
    throw error;
  }
};

export { auth, googleProvider };
