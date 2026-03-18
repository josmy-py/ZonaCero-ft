<template>
  <div>
    <Toast />
    <div class="card">
      <Toolbar class="mb-4">
        <template #start>
          <Button label="Nueva Marca" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />
        </template>
      </Toolbar>

      <DataTable ref="dt" :value="marcas" dataKey="id" :paginator="true" :rows="10" :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} marcas">
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">Gestión de Marcas</h4>

            <div class="p-input-icon-left">
              <i class="pi pi-search"></i>
              <InputText v-model="filters['global'].value" placeholder="Buscar..." />
            </div>
          </div>
        </template>
        <Column field="nombre" header="Marca" sortable style="min-width:16rem"></Column>
        <Column :exportable="false" style="min-width:8rem">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button icon="pi pi-pencil" outlined rounded @click="editMarca(slotProps.data)" />
              <Button icon="pi pi-trash" outlined rounded severity="danger"
                @click="confirmDeleteMarca(slotProps.data)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
    <!--Formulario modal de primevue-->
    <Dialog v-model:visible="dialog" :style="{ width: '450px' }" :header="titleDialog" :modal="true" class="p-fluid">
      <div class="field">
        <label for="name">Nombre</label>
        <InputText id="nombre" v-model.trim="marca.nombre" required="true" autofocus
          :invalid="submitted && !marca.nombre" />
        <small class="p-error" v-if="submitted && !marca.nombre">Nombre es requerido.</small>
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
        <Button :label="labelButton" security="primary" icon="pi pi-save" text @click="saveOrUpdate" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteMarcaDialog" :style="{ width: '450px' }" header="Confirmación" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="marca">Seguro/a de eliminar la marca <b>{{ marca.nombre }}</b>?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteMarcaDialog = false" />
        <Button label="Si" icon="pi pi-check" text @click="deleteMarca" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import api from '@/services/api';


onMounted(() => {
  loadMarcas()
});

const toast = useToast();
const dt = ref();
const marcas = ref([]);
const marca = ref({
  id: null,
  nombre: ''
});
const dialog = ref(false);
const deleteMarcaDialog = ref(false);

const filters = ref({
  'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);

const openNew = () => {
  marca.value = {};
  submitted.value = false;
  dialog.value = true;
};
const hideDialog = () => {
  dialog.value = false;
  submitted.value = false;
};

//función para obtener las marcas
const loadMarcas = async () => {
  try {
    const { data } = await api.get('/marcas');
    marcas.value = data;
  } catch (err) {
    console.log("Error al obtener las marcas", err)
  }
}

const saveOrUpdate = async () => {
  submitted.value = true;
  if (!marca?.value.nombre?.trim()) {
        return;
    }

    try {
        let response;
        if (marca.value.id) {
            // Petición para actualizar la marca
            response = await api.put(`/marcas/${marca.value.id}`, marca.value);
        } else {
            // Registro de nueva marca
            response = await api.post('/marcas', marca.value);
        }
        //desestructurando status y data de la respuesta
        const { status, data } = response;
        if (status === 201) {
            marcas.value.unshift(data.marca);
            toast.add({
                severity: 'success',
                summary: 'Registro exitoso',
                detail: data.message,
                life: 3000
            });
        }
        if (status === 202) {
            const index = marcas.value.findIndex(m => m.id === data.marca.id);
            if (index !== -1) {
                marcas.value[index] = data.marca;
            }
            toast.add({
                severity: 'success',
                summary: 'Actualización exitosa',
                detail: data.message,
                life: 3000
            });
        }
        dialog.value = false;
        marca.value = {};
        submitted.value = false;
    } catch (error) {
        let message = "Error inesperado";

        if (error.response?.data?.errores) {
            const errores = error.response.data.errores;
            message = Object.values(errores)[0][0];
        } else if (error.response?.data?.message) {
            message = error.response.data.message;
        }
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 4000
        });
        console.error(error);
    }
};

const editMarca = (m) => {
  marca.value = { ...m };
  dialog.value = true;
};
const confirmDeleteMarca = (m) => {
  marca.value = m;
  deleteMarcaDialog.value = true;
};
const deleteMarca = async () => {

    try {
        const response = await api.delete(`/marcas/${marca.value.id}`);
        const { status, data } = response;

        if (status === 200) {
            marcas.value = marcas.value.filter(val => val.id !== marca.value.id);
            toast.add({
                severity: 'success',
                summary: 'Eliminado',
                detail: data.message,
                life: 3000
            });

        }
        deleteMarcaDialog.value = false;
        marca.value = {};

    } catch (error) {
        let message = "Error inesperado";
        if (error.response?.status === 409) {
            message = error.response.data.message;
        }
        else if (error.response?.status === 404) {
            message = error.response.data.message;
        }
        else if (error.response?.data?.message) {
            message = error.response.data.message;
        }
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 4000
        });
        deleteMarcaDialog.value = false;
        console.error(error);
    }
};

//funciones computables para determinar si esta agregando o editando un registro
const titleDialog = computed(() => {
    return marca.value.id ? "Edición de Marcas" : "Registro de Marcas"
})

const labelButton = computed(() => {
    return marca.value.id ? "Actualizar" : "Guardar"
})

</script>
