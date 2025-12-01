export interface AlertI {
  id?:       number;
  icon?:     string;
  title:     string;
  message:   string;
  type:      'success' | 'error' | 'info' | 'warning';
  disabled?: boolean;
  isAction? : boolean;
  timeout? : number
}
