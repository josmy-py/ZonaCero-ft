<template>
  <div class="space-y-8">
    <!-- Encabezado del Dashboard -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <h2 class="text-2xl font-bold text-gray-800">Dashboard Administrativo</h2>

      <span class="text-sm font-bold text-gray-500"> Año {{ anioActual }} </span>
    </div>

    <!-- Grid de tailwind para pintar las card con los datos de las ordenes por estado -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      <div class="card">
        <div class="icon bg-blue-100 text-blue-600">
          <i class="pi pi-chart-line"></i>
        </div>

        <div>
          <p class="label">Ventas Totales</p>
          <h3 class="value">
            {{ formatoMoneda(resumen.ventas_totales) }}
          </h3>
        </div>
      </div>

      <div class="card">
        <div class="icon bg-yellow-100 text-yellow-600">
          <i class="pi pi-clock"></i>
        </div>

        <div>
          <p class="label">Órdenes Pendientes</p>
          <h3 class="value">{{ resumen.ordenes_pendientes }}</h3>
        </div>
      </div>

      <div class="card">
        <div class="icon bg-green-100 text-green-600">
          <i class="pi pi-check-circle"></i>
        </div>

        <div>
          <p class="label">Órdenes Pagadas</p>
          <h3 class="value">{{ resumen.ordenes_pagadas }}</h3>
        </div>
      </div>

      <div class="card">
        <div class="icon bg-red-100 text-red-600">
          <i class="pi pi-times-circle"></i>
        </div>

        <div>
          <p class="label">Órdenes Canceladas</p>
          <h3 class="value">{{ resumen.ordenes_canceladas }}</h3>
        </div>
      </div>

      <div class="card">
        <div class="icon bg-purple-100 text-purple-600">
          <i class="pi pi-refresh"></i>
        </div>

        <div>
          <p class="label">Órdenes Reembolsadas</p>
          <h3 class="value">{{ resumen.ordenes_reembolsadas }}</h3>
        </div>
      </div>
    </div>

    <!-- GRAFICOS -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Ventas Mensuales -->
      <div class="panel">
        <h3 class="panel-title">Ventas por Mes</h3>

        <div class="h-[320px]">
          <canvas ref="ventasChart"></canvas>
        </div>
      </div>
      <!-- Ventas por ano -->
      <div class="panel">
        <h3 class="panel-title">Ventas por Año</h3>

        <div class="h-[320px]">
          <canvas ref="ventasAnioChart"></canvas>
        </div>
      </div>

      <!-- Top productos -->
      <div class="panel">
        <h3 class="panel-title">Top Productos Vendidos</h3>

        <ul class="space-y-3">
          <li v-for="p in topProductos" :key="p.nombre" class="flex justify-between border-b pb-2">
            <span class="text-gray-700">
              {{ p.nombre }}
            </span>

            <span class="font-semibold">
              {{ p.vendidos }}
            </span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Mostrando últimas 10 órdenes -->
    <div class="panel">
      <h3 class="panel-title mb-4">Últimas Órdenes</h3>

      <DataTable :value="ultimasOrdenes" responsiveLayout="scroll" class="p-datatable-sm">
        <Column field="correlativo" header="Orden" />

        <Column header="Cliente">
          <template #body="slotProps">
            {{ slotProps.data.user?.name }}
          </template>
        </Column>

        <Column field="total" header="Total">
          <template #body="slotProps">
            {{ formatoMoneda(slotProps.data.total) }}
          </template>
        </Column>

        <Column field="estado" header="Estado" />

        <Column field="fecha" header="Fecha" />
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";
import dashboardService from "@/services/dashboardService";

const anioActual = new Date().getFullYear();

const resumen = ref({});

const ventasChart = ref(null);
let chartInstance = null;

const ventasAnioChart = ref(null);
let chartVentasAnio = null;

const topProductos = ref([]);
const ultimasOrdenes = ref([]);

/* Función para dar formato de moneda */

const formatoMoneda = (valor) => {
  return new Intl.NumberFormat("es-SV", {
    style: "currency",
    currency: "USD",
  }).format(valor);
};

/* Función para obtener resumen de las ordenes  */
const loadResumen = async () => {
  const res = await dashboardService.getResumen();

  resumen.value = res.data;
};

/* Función para preperar el dataset (datos) para el gráfico de ventas por mes */
const loadVentasMes = async () => {
  const res = await dashboardService.ventasMes();

  const labels = res.data.map((v) => v.mes);
  const data = res.data.map((v) => v.total);

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ventasChart.value, {
    type: "line",

    data: {
      labels,

      datasets: [
        {
          label: "Ventas",
          data,
          borderWidth: 3,
          tension: 0.4,
          fill: true,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
};

//funcion para obtener ventas por año
const loadVentasAnio = async () => {
  const res = await dashboardService.ventasAnio();

  const labels = res.data.map((v) => v.anio);
  const data = res.data.map((v) => v.total);

  if (chartVentasAnio) {
    chartVentasAnio.destroy();
  }

  chartVentasAnio = new Chart(ventasAnioChart.value, {
    type: "bar",

    data: {
      labels,
      datasets: [
        {
          label: "Ventas por Año",
          data,
          borderWidth: 1,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
};

const loadTopProductos = async () => {
  const res = await dashboardService.topProductos();

  topProductos.value = res.data;
};

const loadUltimasOrdenes = async () => {
  const res = await dashboardService.ultimasOrdenes();

  ultimasOrdenes.value = res.data;
};

onMounted(() => {
  loadResumen();
  loadVentasMes();
  loadVentasAnio();
  loadTopProductos();
  loadUltimasOrdenes();
});
</script>

<style scoped>
.card {
  @apply bg-white p-5 rounded-xl shadow-sm flex items-center gap-4 hover:shadow-md transition;
}

.icon {
  @apply flex items-center justify-center w-12 h-12 rounded-lg text-xl;
}

.label {
  @apply text-gray-500 text-sm;
}

.value {
  @apply font-bold text-xl text-gray-800;
}

.panel {
  @apply bg-white rounded-xl shadow-sm p-6;
}

.panel-title {
  @apply text-lg font-semibold text-gray-700 mb-3;
}
</style>
