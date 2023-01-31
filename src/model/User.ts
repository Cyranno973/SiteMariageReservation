enum status{ 'present', 'absent', 'incomplet'}
export interface User{
  id?: number,
  username?: string,
  name?: string,
  mail?: string,
  tel?: string,
  statusUser?: status,
  menu?: string,
  famille: User[]

}
