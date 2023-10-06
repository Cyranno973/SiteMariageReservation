import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";
import {combineLatest, map, Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {StoreUserService} from "./store-user.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGard  {
  constructor(private storeUserService: StoreUserService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const subAdmin = this.storeUserService.observeIsAdmin();
    const subUser = this.storeUserService.observeUser();
    return combineLatest([subAdmin, subUser]).pipe(map(x => {
      // console.log(x)
      if (x[0]) {
       // console.log('admin activé')
        return true
      } else if (x[1] && state.url !== '/admin') {
        return true
      } else {
        this.router.navigate(['/home']);
        return false
      }
    }))
  }
}
