<template>
  <div>
    <!-- Barra superior -->
    <div class="bg-black text-gray-400 text-sm px-6 py-2 flex justify-between items-center border-b border-gray-700">
      <div class="flex gap-6">
        <span class="cursor-pointer hover:text-white transition">Contactanos</span>
        <span class="cursor-pointer hover:text-white transition">Ayuda</span>
      </div>
      <div class="flex items-center gap-6">
        <!-- Botón Admin - solo si es admin -->
        <router-link
          v-if="authStore.isAdmin"
          to="/admin/dashboard"
          class="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-full transition duration-300 font-medium"
        >
          <span>⚙️</span>
          <span>Admin</span>
        </router-link>

        <!-- Botón Iniciar Sesión -->
        <button
          v-if="!authStore.isAuthenticated"
          @click="showLoginModal = true"
          class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full transition duration-300 font-medium"
        >
          <span>👤</span>
          <span>Iniciar sesión</span>
        </button>

        <!-- Usuario logueado -->
        <div v-else class="flex items-center gap-4">
          <span class="text-white">Hola, {{ authStore.user?.name || 'Usuario' }}</span>
          <button
            @click="handleLogout"
            class="text-gray-400 hover:text-white transition"
          >
            Cerrar sesión
          </button>
        </div>

        <!-- Ver Carrito - solo si está autenticado -->
        <button
          v-if="authStore.isAuthenticated"
          @click="$router.push('/order')"
          class="cursor-pointer hover:text-white transition flex items-center gap-1"
        >
          <span>🛒</span>
          <span>Ver Carrito</span>
          <span
            v-if="orderStore.totalItems > 0"
            class="bg-red-500 text-white text-xs px-1.5 rounded-full"
          >
            {{ orderStore.totalItems }}
          </span>
        </button>
        <button
          v-else
          @click="showLoginModal = true"
          class="cursor-pointer hover:text-white transition"
        >
          Ver Carrito
        </button>

        <!-- Mi Cartera - podría ser mis órdenes -->
        <router-link
          v-if="authStore.isAuthenticated"
          to="/mis-ordenes"
          class="cursor-pointer hover:text-white transition"
        >
          Mis Órdenes
        </router-link>
      </div>
    </div>

    <!-- Barra principal del navbar -->
    <div class="bg-black text-gray-400 px-6 py-4 flex items-center justify-between">
      <!-- LOGO -->
      <router-link to="/" class="text-2xl font-bold text-white hover:text-blue-400 transition">
        Zona Cero
      </router-link>

      <!-- Barra de búsqueda -->
      <div class="flex items-center flex-1 max-w-xl mx-8">
        <div class="bg-gray-800 px-4 py-2 flex items-center gap-3 w-full rounded-lg">
          <span class="text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Buscar Productos de Tecnología..."
            class="bg-transparent outline-none text-white placeholder-gray-400 flex-1"
          />
        </div>
      </div>

      <!-- Icons -->
      <div class="flex items-center gap-6 text-xl">
        <!-- Favoritos - por ahora link decorativo -->
        <router-link to="/" class="cursor-pointer hover:text-white transition" title="Favoritos">
          ❤️
        </router-link>

        <!-- Carrito con contador de items -->
        <router-link
          v-if="authStore.isAuthenticated"
          to="/order"
          class="relative cursor-pointer hover:text-white transition"
          title="Carrito"
        >
          <span>🛒</span>
          <span
            v-if="orderStore.totalItems > 0"
            class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
          >
            {{ orderStore.totalItems }}
          </span>
        </router-link>

        <!-- Si no está autenticado, mostrar modal de login -->
        <button
          v-else
          @click="showLoginModal = true"
          class="cursor-pointer hover:text-white transition"
          title="Iniciar sesión para ver carrito"
        >
          🛒
        </button>
      </div>
    </div>

    <!-- Menú de categorías -->
    <div class="bg-gray-800 text-white px-6 py-3 flex gap-8">
      <div class="relative group">
        <span class="cursor-pointer hover:text-white transition flex items-center gap-1">
          Categorías <span class="text-xs">▼</span>
        </span>
        <!-- Dropdown de categorías desde la base de datos -->
        <div class="absolute top-full left-0 bg-gray-900 text-white py-2 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 min-w-48">
          <a
            v-for="categoria in categorias"
            :key="categoria.id"
            href="#"
            class="block px-4 py-2 hover:bg-gray-700 transition"
            @click.prevent="filtrarPorCategoria(categoria.nombre)"
          >
            {{ categoria.nombre }}
          </a>
        </div>
      </div>
    </div>

    <!-- Modal de Login -->
    <LoginModal
      :show="showLoginModal"
      @close="showLoginModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useOrderStore } from '@/stores/orderStore';
import { useProductStore } from '@/stores/productStore';
import api from '@/services/api';
import router from '@/router';
import LoginModal from '@/components/home/LoginModal.vue';

const authStore = useAuthStore();
const orderStore = useOrderStore();
const productStore = useProductStore();
const showLoginModal = ref(false);
const categorias = ref([]);

const handleLogout = async () => {
  await authStore.logout();
  router.push('/');
};

// Cargar categorías desde la base de datos
const fetchCategorias = async () => {
  try {
    const response = await api.get('/categorias');
    categorias.value = response.data;
  } catch (error) {
    console.error('Error al cargar categorías:', error);
  }
};

// Filtrar productos por categoría
const filtrarPorCategoria = (categoriaNombre) => {
  productStore.setCategory(categoriaNombre);
  router.push('/');
};

onMounted(() => {
  fetchCategorias();
});
</script>
