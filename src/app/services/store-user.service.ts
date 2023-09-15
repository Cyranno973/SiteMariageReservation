import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {User} from "../../model/user";

@Injectable({
  providedIn: 'root'
})
export class StoreUserService {
  private storeUserList: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private storeUser: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private storeIsLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  private storeIsAdmin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  observeUser() {
    return this.storeUser.asObservable();
  }

  saveUser(user: User) {
    this.storeUser.next(user)
  }

  clearUser() {
    this.storeUser.next(null);
    this.storeIsAdmin.next(false);
  }

  observeUserList() {
    return this.storeUserList.asObservable();
  }

  saveUserList(data: any) {
    return this.storeUserList.next(data)
  }

  observeIsLoggedIn() {
    return this.storeIsLoggedIn.asObservable();
  }

  saveIsLoggedIn(bool: boolean) {
    this.storeIsLoggedIn.next(bool)
  }

  observeIsAdmin(): Observable<boolean> {
    return this.storeIsAdmin.asObservable();
  }

  saveIsAdmin(bool: boolean) {
    this.storeIsAdmin.next(bool)
  }
}
