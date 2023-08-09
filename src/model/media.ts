export interface Entity {
  id: string;
  order: number;
}
export interface Media  extends Entity {
  title: string;
  imageUrl: string;
  description: string;
  urlExterne: string;
  file?: File;
}
