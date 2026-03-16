import api from "./api";

export default {
  getResumen() {
    return api.get("/admin/dashboard/resumen");
  },

  ventasMes() {
    return api.get("/admin/dashboard/ventas-mes");
  },

  ventasAnio() {
    return api.get("/admin/dashboard/ventas-anio");
  },

  topProductos() {
    return api.get("/admin/dashboard/top-productos");
  },
  ultimasOrdenes() {
    return api.get("/admin/dashboard/ultimas-ordenes");
  },

};
