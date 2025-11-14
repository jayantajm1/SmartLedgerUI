export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Accountant' | 'Viewer';
  created_at: string;
}
