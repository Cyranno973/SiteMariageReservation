export enum Status {
  Present = 'present',
  Absent = 'absent',
  Incomplete = 'incomplete',
  First = 'first'
}
export enum Menu {
  Fish = 'Poisson',
  Meat = 'Viande',
}
export enum Choice {
  P = 'p',
  A = 'a',
  All = 'all'
}

export interface User {
  id: string,
  username?: string,
  name?: string,
  mail?: string,
  tel?: string,
  statusUser?: Status,
  menu?: Menu,
  choice: Choice,
  famille?: User[]
}

