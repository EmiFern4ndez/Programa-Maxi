export interface Programa {
    id?: number | string;
    codigo: string;
    nombre?: string;
    descripcion?: string;
}

export interface Categoria {
    id?: number | string;
    numero: number;
    descripcion?: string;
}

export interface OpcionesPersonalDTO {
    programas: Programa[] | string[];
    categorias: Categoria[] | number[];
}