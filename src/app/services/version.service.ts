import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VersionService {
  public version: string = '1.0.0';
  constructor() { }
}
