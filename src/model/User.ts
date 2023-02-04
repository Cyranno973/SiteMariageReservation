
export enum Status {
  Present = 'present',
  Absent = 'absent',
  Incomplet = 'incomplet',
}
export interface User{
  id: string,
  username?: string,
  name?: string,
  mail?: string,
  tel?: string,
  statusUser?: Status,
  menu?: string,
  famille?: User[]
}

