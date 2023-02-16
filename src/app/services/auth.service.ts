import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {UserService} from "./user.service";
import {StoreUserService} from "./store-user.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
// behavioSubjectIsNumeroPresent: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
//   constructor(private storeUserService: StoreUserService) { }
//   admin: boolean = false;
//   isAdmin(): Observable<boolean> {
//     return this.storeUserService.observeIsAdmin((isAdmin: boolean) =>  isAdmin)
//   }
}
