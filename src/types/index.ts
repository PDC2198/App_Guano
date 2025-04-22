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

//Formulario de lectura
export type LecturaFormInput = {
  ruta: string;
  ordenLectura: string;
  numeroCuenta: string;
  lecturaActual: string;
  consumo: string;
  observacion?: string;
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
};

//Params de rutas
export type ParamsLectura = {
  ruta?: string, 
  estado?: boolean
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
export type Rutas =     {
  orden: number,
  cuenta: string,
  lectura: string,
}