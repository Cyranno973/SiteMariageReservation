enum status{ 'present', 'absent', 'incomplet'}
export interface User{
  id: number,
  username: string,
  name: string,
  mail: string,
  tel: number,
  statusUser: status
}
