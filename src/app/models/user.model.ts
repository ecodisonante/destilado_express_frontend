
export interface User {
    nombre: string;
    email: string;
    password: string;
    direccion: string;
    rol: Rol;
}

export interface Rol {
    id: number;
    nombre: string;
}
