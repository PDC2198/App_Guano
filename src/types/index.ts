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

export type LecturaFormInput = {
  ruta: string;
  ordenLectura: string;
  numeroCuenta: string;
  lecturaActual: string;
  consumo: string;
  observacion?: string;
}


export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Home: undefined;
  Reading: undefined;
  About: undefined;
  Send: undefined;
};