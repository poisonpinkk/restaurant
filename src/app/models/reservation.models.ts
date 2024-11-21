export interface Reservation {
    id?: string;         // Generado automáticamente por Firestore
    uid: string;         // UID del usuario que realiza la reserva
    rol: string;         // Rol del usuario (cliente o empresa)
    fecha: string;       // Fecha de la reserva
    hora?: string;       // Hora de la reserva (para clientes)
    horaDesde?: string;  // Hora de inicio (para empresas)
    horaHasta?: string;  // Hora de término (para empresas)
    cantidad: number;    // Cantidad de personas
    detalles?: string;   // Detalles adicionales (como tipo de comida)
  }