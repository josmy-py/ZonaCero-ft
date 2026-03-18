<template>
  <div class="bg-gray-50 min-h-screen flex flex-col">
    <Navbar />
    
    <!-- Carrusel Principal (lo más importante) -->
    <ProductSlider />
    
    <!-- Categorías debajo del carrusel -->
    <CategoryBar />
    
    <!-- Grid de productos -->
    <ProductGrid />
    
    <!-- Marcas -->
    <section class="bg-white py-12">
      <div class="container mx-auto px-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-8 text-center">Marcas Destacadas</h2>
        <div class="flex flex-wrap justify-center items-center gap-8">
          <div class="w-32 h-16 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition cursor-pointer">
            <span class="text-gray-600 font-semibold">Apple</span>
          </div>
          <div class="w-32 h-16 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition cursor-pointer">
            <span class="text-gray-600 font-semibold">Samsung</span>
          </div>
          <div class="w-32 h-16 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition cursor-pointer">
            <span class="text-gray-600 font-semibold">Lenovo</span>
          </div>
          <div class="w-32 h-16 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition cursor-pointer">
            <span class="text-gray-600 font-semibold">HP</span>
          </div>
          <div class="w-32 h-16 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition cursor-pointer">
            <span class="text-gray-600 font-semibold">Dell</span>
          </div>
          <div class="w-32 h-16 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition cursor-pointer">
            <span class="text-gray-600 font-semibold">Asus</span>
          </div>
          <div class="w-32 h-16 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition cursor-pointer">
            <span class="text-gray-600 font-semibold">Microsoft</span>
          </div>
        </div>
      </div>
    </section>
    
    <Footer />
  </div>
</template>

<script setup>
  import Navbar from "@/components/layouts/NavBar.vue";
  import Footer from "@/components/layouts/Footer.vue";
  import CategoryBar from "@/components/home/CategoryBar.vue";
  import ProductSlider from "@/components/home/ProductSlider.vue";
  import ProductGrid from "@/components/home/ProductGrid.vue";
</script>
