import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from "@angular/router";
import { Observable } from "rxjs";
import {Injectable} from "@angular/core";
@Injectable({
  providedIn: 'root'
})
export class AuthGard implements CanActivate{
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
  return true
  }

}
