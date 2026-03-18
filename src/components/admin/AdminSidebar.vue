<template>
  <aside
    :class="[
      'bg-black text-gray-200 w-64 min-h-screen fixed md:relative z-40 transition-transform duration-300',

      open ? 'translate-x-0' : '-translate-x-full',

      !isMobile && open ? 'md:translate-x-0' : '',
    ]"
  >
    <div class="p-6 border-b border-gray-800">
      <div class="flex items-center gap-3">
        <div class="bg-blue-600 p-2 rounded">
          <i class="pi pi-shopping-bag text-white"></i>
        </div>

        <h2 class="font-bold text-lg text-white">Zona Cero</h2>
      </div>
    </div>

    <nav class="mt-4 flex flex-col text-sm">
      <router-link
        to="/admin/dashboard"
        class="menu-item"
        @click="$emit('navigate')"
      >
        <i class="pi pi-objects-column"></i>
        Inicio
      </router-link>

      <router-link
        to="/admin/catalogos/marcas"
        class="menu-item"
        @click="$emit('navigate')"
      >
        <i class="pi pi-tag"></i>
        Marcas
      </router-link>

      <router-link
        to="/admin/catalogos/categorias"
        class="menu-item"
        @click="$emit('navigate')"
      >
        <i class="pi pi-list"></i>
        Categorías
      </router-link>

      <router-link
        to="/admin/productos"
        class="menu-item"
        @click="$emit('navigate')"
      >
        <i class="pi pi-tag"></i>
        Productos
      </router-link>

      <router-link
        to="/admin/ordenes"
        class="menu-item"
        @click="$emit('navigate')"
      >
        <i class="pi pi-file"></i>
        Pedidos
      </router-link>

      <router-link
        to="/admin/usuarios"
        class="menu-item"
        @click="$emit('navigate')"
      >
        <i class="pi pi-id-card"></i>
        Usuarios
      </router-link>

      <router-link
        to="/admin/reportes"
        class="menu-item"
        @click="$emit('navigate')"
      >
        <i class="pi pi-chart-line"></i>
        Reportes
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
defineProps({
  open: Boolean,
  isMobile: Boolean,
});
</script>

<style scoped>
.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  transition: all 0.2s;
  color: #9ca3af;
}

.menu-item:hover {
  background: #1f2937;
  color: white;
}

.router-link-active {
  background: #2563eb;
  color: white;
}
</style>