// src/services/api.ts
import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// --- INTERFACES DE DATOS ---

export interface Localidad {
    codigoPostal: string;
    nombre: string;
}

export interface BienPatrimonial {
    numeroInventario: string;
    descripcion: string;
    marca?: string;
    cantidad?: number;
    fechaIngreso?: string;
    importeTotal?: number;
    estado?: string;
    codigoPatrimonial?: string;
    localidad?: Localidad;
    cuilDepositario?: string;
    cuilResponsable?: string;
}

export interface Personal {
    cuil: string;
    nombreApellido: string;
    codigoPrograma?: string;
    categoria?: number;
    bienesACargo?: {
        numeroInventario: string;
        descripcion: string;
        marca?: string;
        estado?: string;
    }[];
}

export interface Vehiculo {
    dominio: string;
    marca?: string;
    modeloAnio?: number;
}

// --- SERVICIOS DE LA API ---

export const BienesService = {
    getAll: () => api.get<BienPatrimonial[]>('/bienes').then(res => res.data),
    create: (bien: BienPatrimonial) => api.post<BienPatrimonial>('/bienes', bien).then(res => res.data),
    update: (inv: string, bien: BienPatrimonial) => api.put<BienPatrimonial>(`/bienes/${inv}`, bien).then(res => res.data),
    delete: (inv: string) => api.delete(`/bienes/${inv}`),
};

export const PersonalService = {
    getAll: () => api.get<Personal[]>('/personal').then(res => res.data),
    create: (p: Personal) => api.post<Personal>('/personal', p).then(res => res.data),
    delete: (cuil: string) => api.delete(`/personal/${cuil}`),
};

export const VehiculosService = {
    getAll: () => api.get<Vehiculo[]>('/vehiculos').then(res => res.data),
    create: (v: Vehiculo) => api.post<Vehiculo>('/vehiculos', v).then(res => res.data),
    delete: (dominio: string) => api.delete(`/vehiculos/${dominio}`),
};