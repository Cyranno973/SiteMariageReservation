import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {map, Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {StoreUserService} from "./services/store-user.service";
@Injectable({
  providedIn: 'root'
})
export class AuthGard implements CanActivate{
  constructor(private storeUserService: StoreUserService, private router: Router) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // console.log(this.router.routerState.snapshot.url)
    if(this.router.routerState.snapshot.url === '/admin'){
      // console.log('aaaaa ')
      return this.storeUserService.observeIsAdmin().pipe(map(e => {
          if(e){
            return true
          }else {
            this.router.navigate(['/hom']);
            return false
          }
        })
      )
    }else{
      return this.storeUserService.observeUser().pipe(map(e => {
          if(e){
            return true
          }else {
            this.router.navigate(['/hom']);
            return false
          }
        })
      )
    }
  }

}
