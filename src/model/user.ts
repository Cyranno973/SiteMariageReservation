export enum Status {
  Incomplete = 'incomplete',
  Complete = 'complete',
  First = 'first'
}

export enum Menu {
  Fish = 'Poisson',
  Meat = 'Viande',
  Child = 'Menu enfant'
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
  menu?: Menu,
  selectedCategory: string ,
}

export interface User extends Personne {
  id: string,
  tel?: string,
  statusUser?: Status,
  choice: Choice,
  organisation: boolean,
  accompaniement?: Personne[]
}

