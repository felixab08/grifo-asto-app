


export interface LoginResponse {
  code:    number;
  message: string;
  data:    UserData;
}

export interface UserData {
  access_token: string;
  apellido:     string;
  email:        string;
  id:           number;
  nombre:       string;
  role:         string;
  telefono:     string;
  token_type:   string;
  username:     string;
}
