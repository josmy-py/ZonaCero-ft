<template>
  <section class="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800">
    <!-- Carrusel de imágenes -->
    <div class="relative h-full">
      <transition-group name="fade" tag="div" class="h-full">
        <div 
          v-for="(slide, index) in slides" 
          :key="index"
          v-show="currentSlide === index"
          class="absolute inset-0 flex items-center justify-center"
        >
          <!-- Imagen de fondo -->
          <div class="absolute inset-0 bg-black/40"></div>
          <img 
            :src="slide.imagen" 
            :alt="slide.titulo"
            class="absolute inset-0 w-full h-full object-cover"
          />
          
          <!-- Contenido del slide -->
          <div class="relative z-10 container mx-auto px-6 text-center">
            <h2 class="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              {{ slide.titulo }}
            </h2>
            <p class="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-md">
              {{ slide.descripcion }}
            </p>
            <button 
              @click="handleCtaClick(slide)"
              class="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
            >
              {{ slide.cta }}
            </button>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- Botones de navegación -->
    <button 
      @click="prevSlide"
      class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white w-12 h-12 rounded-full flex items-center justify-center transition duration-300 z-20"
    >
      <span class="text-2xl">‹</span>
    </button>
    <button 
      @click="nextSlide"
      class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white w-12 h-12 rounded-full flex items-center justify-center transition duration-300 z-20"
    >
      <span class="text-2xl">›</span>
    </button>

    <!-- Indicadores -->
    <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
      <button 
        v-for="(slide, index) in slides" 
        :key="index"
        @click="currentSlide = index"
        class="w-3 h-3 rounded-full transition duration-300"
        :class="currentSlide === index ? 'bg-blue-500 w-8' : 'bg-white/50 hover:bg-white/70'"
      ></button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { useProductStore } from '@/stores/productStore';

const router = useRouter();
const productStore = useProductStore();

const currentSlide = ref(0);
const slides = ref([]);
let interval = null;

// Imágenes por defecto para las categorías - usando imágenes de la carpeta public
const imagenesCategorias = {
  'hardware': 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=1920&q=80',
  'laptops': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1920&q=80',
  'consolas': 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1920&q=80',
  'accesorios': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1920&q=80',
  'videojuegos': 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1920&q=80',
  'monitores': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1920&q=80',
  'default': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80'
};

const descripcionesCategorias = {
  'hardware': 'Los mejores componentes para tu PC',
  'laptops': 'Encuentra las mejores laptops con tecnología de punta',
  'consolas': 'Las consolas más populares del momento',
  'accesorios': 'Completa tu setup con los mejores accesorios',
  'videojuegos': 'Los mejores juegos para todas las plataformas',
  'monitores': 'Visualiza todo con la mejor calidad',
  'default': 'Los mejores productos tecnológicos para ti'
};

// Cargar categorías desde la base de datos
const fetchCategorias = async () => {
  try {
    const response = await api.get('/categorias');
    const categorias = response.data;
    
    // Generar slides dinámicamente según las categorías
    slides.value = categorias.map((cat) => ({
      titulo: cat.nombre,
      descripcion: descripcionesCategorias[cat.nombre.toLowerCase()] || descripcionesCategorias['default'],
      imagen: imagenesCategorias[cat.nombre.toLowerCase()] || imagenesCategorias['default'],
      cta: 'Ver Más',
      categoria: cat.nombre
    }));
  } catch (error) {
    console.error('Error al cargar categorías:', error);
    // Si hay error, usar slides por defecto
    slides.value = getSlidesPorDefecto();
  }
};

const getSlidesPorDefecto = () => [
  {
    titulo: 'Últimos Laptops',
    descripcion: 'Encuentra las mejores laptops con tecnología de punta',
    imagen: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1920&q=80',
    cta: 'Ver Más',
    categoria: 'laptop'
  },
  {
    titulo: 'Smartphones Premium',
    descripcion: 'Los teléfonos más innovadores del mercado',
    imagen: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1920&q=80',
    cta: 'Explorar',
    categoria: 'smartphone'
  },
  {
    titulo: 'Gaming Equipment',
    descripcion: 'Equipa tu setup gaming con los mejores accesorios',
    imagen: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1920&q=80',
    cta: 'Ver Ofertas',
    categoria: 'gaming'
  },
  {
    titulo: 'Audio Premium',
    descripcion: 'Experimenta el sonido como nunca antes',
    imagen: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1920&q=80',
    cta: 'Descubrir',
    categoria: 'audio'
  },
  {
    titulo: 'Componentes PC',
    descripcion: 'Arma o mejora tu computadora ideal',
    imagen: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=1920&q=80',
    cta: 'Ver Componentes',
    categoria: 'componente'
  }
];

const nextSlide = () => {
  if (slides.value.length > 0) {
    currentSlide.value = (currentSlide.value + 1) % slides.value.length;
  }
};

const prevSlide = () => {
  if (slides.value.length > 0) {
    currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length;
  }
};

const startAutoplay = () => {
  interval = setInterval(nextSlide, 5000);
};

const stopAutoplay = () => {
  if (interval) {
    clearInterval(interval);
  }
};

const handleCtaClick = (slide) => {
  // Emitir evento para filtrar por categoría
  window.dispatchEvent(new CustomEvent('filterCategory', { detail: slide.categoria }));
  // Also update the product store
  productStore.setCategory(slide.categoria);
  // Navigate to home
  router.push({ path: '/', query: { categoria: slide.categoria } });
};

onMounted(async () => {
  await fetchCategorias();
  startAutoplay();
});

onUnmounted(() => {
  stopAutoplay();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
