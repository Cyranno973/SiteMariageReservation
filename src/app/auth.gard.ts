import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {map, Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {StoreUserService} from "./services/store-user.service";
@Injectable({
  providedIn: 'root'
})
export class AuthGard implements CanActivate{
  constructor(private storeUserService: StoreUserService, private router: Router, private ac:ActivatedRoute) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if(state.url === '/admin'){
      return this.storeUserService.observeIsAdmin().pipe(map(bool => {
          if(bool) return true
          else {
            this.router.navigate(['/home']);
            return false
          }
        })
      )
    }else{
      return this.storeUserService.observeUser().pipe(map(user => {
          if(user) return true
          else {
            this.router.navigate(['/home']);
            return false
          }
        })
      )
    }
  }

}
