import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {User} from "../../model/User";


@Injectable({
  providedIn: 'root'
})
export class StoreUserService {
  private storeUserList: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private storeUser: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private storeIsLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  observeUser() {
    return this.storeUser.asObservable();
  }

  saveUser(user: User) {
    this.storeUser.next(user)
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
}
