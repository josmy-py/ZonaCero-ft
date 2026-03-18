<template>
  <Teleport to="body">
    <transition name="modal">
      <div 
        v-if="show" 
        class="fixed inset-0 z-50 flex items-center justify-center"
        @click.self="closeModal"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-center">
            <h2 class="text-2xl font-bold text-white">Zona Cero</h2>
            <p class="text-blue-100 mt-1">Tu tienda de tecnología</p>
            <button 
              @click="closeModal"
              class="absolute top-4 right-4 text-white/80 hover:text-white transition"
            >
              <span class="text-2xl">×</span>
            </button>
          </div>

          <!-- Body -->
          <div class="p-8">
            <h3 class="text-xl font-semibold text-gray-800 text-center mb-6">
              Iniciar Sesión
            </h3>

            <!-- Divider -->
            <div class="flex items-center gap-4 my-6">
              <div class="flex-1 h-px bg-gray-200"></div>
              <span class="text-gray-400 text-sm">Ingresa tus datos</span>
              <div class="flex-1 h-px bg-gray-200"></div>
            </div>

            <!-- Email Login Form -->
            <form @submit.prevent="handleEmailLogin" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  v-model="emailForm.email"
                  type="email"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input
                  v-model="emailForm.password"
                  type="password"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                :disabled="loading"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-300 disabled:opacity-50"
              >
                {{ loading ? 'Iniciando...' : 'Iniciar Sesión' }}
              </button>
            </form>

            <!-- Register Link -->
            <p class="mt-6 text-center text-gray-600">
              ¿No tienes cuenta?
              <router-link 
                to="/register" 
                @click="closeModal"
                class="text-blue-600 hover:text-blue-700 font-medium"
              >
                Regístrate
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const authStore = useAuthStore();
const loading = ref(false);
const emailForm = ref({
  email: '',
  password: ''
});

const closeModal = () => {
  emit('close');
};

// Login con email y contraseña
const handleEmailLogin = async () => {
  loading.value = true;
  try {
    await authStore.login(emailForm.value);
    closeModal();
  } catch (error) {
    console.error('Error en login:', error);
  } finally {
    loading.value = false;
  }
};

// Prevenir scroll cuando el modal está abierto
watch(() => props.show, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.9);
}
</style>
