import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
behavioSubjectIsNumeroPresent: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private userService: UserService) { }
  login(){
  // this.userService.getAll().
  }
  isLoggedIN(isNumeroPresent: boolean): boolean {
    return true
    // return this.behavioSubjectIsNumeroPresent.next(isNumeroPresent)
  }
}
