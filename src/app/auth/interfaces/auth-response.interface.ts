


export interface LoginResponse {
  code:    number;
  message: string;
  data:    UserData;
}

export interface UserData extends IPersonaResponse {
  access_token: string;
  token_type:   string;
  username:     string;
}

export interface IPersonaResponse {
  apellido:     string;
  nombre:       string;
  id:           number;
  email?:        string;
  role:         string;
  telefono?:     string;
}
