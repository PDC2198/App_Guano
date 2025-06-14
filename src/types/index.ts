export type LecturaT = {
  ruta: string;
  fecha: string;
  ordenLectura: number;
  numeroCuenta: string;
  lecturaActual: number;
  consumo: number;
  observacion?: string;
  foto?: string; 
}

export type LecturaEdit = LecturaT & {
  id: number
}

//Formulario de lectura
export type LecturaFormInput = {
  ruta: string;
  ordenLectura: string;
  numeroCuenta: string;
  lecturaActual: string;
  consumo: string;
  lecturaInicial: string
}

//Type de rutas
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Home: undefined;
  Reading: undefined;
  About: undefined;
  Send: undefined;
  EditReading: { id: string};
};

//Params de rutas
export type ParamsLectura = {
  ruta?: string;
  estado?: boolean;
  page: number;
  pageSize: number;
}

// Type para paginacion
export type Pagination = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

//Lecturas getAll
export type LecturaRecord = {
  consumo: string;
  createdAt: string; 
  estado: number;
  fecha: string; 
  foto: string | null; 
  id: number;
  lecturaActual: number;
  numeroCuenta: number;
  observacion: string | null;
  ordenLectura: number;
  ruta: string;
  updatedAt: string;
};


//Type para rutas
export type Ruta =     {
  orden: number,
  cuenta: string,
  lectura: string,
}