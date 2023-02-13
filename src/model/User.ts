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
export interface Personne {
  username?: string,
  name?: string,
  allergie?: string,
  menu?: Menu ,
}

export interface User extends Personne{
  id: string,

  mail?: string,
  tel?: string,
  statusUser?: Status ,

  choice: Choice,

  accompaniement?: Personne[]
}

