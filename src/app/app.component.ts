import {Component, HostListener, OnInit} from '@angular/core';
import {Choice, User} from "../model/user";
import {UserService} from "./services/user.service";
import {StoreUserService} from "./services/store-user.service";
import {NavigationEnd, Router, RouterOutlet} from "@angular/router";

import {Observable, of, switchMap} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {SwUpdate} from "@angular/service-worker";
import {routeAnimations} from "./route-animations";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimations],
})
export class AppComponent implements OnInit {

  secretCode: string = "ArrowLeftArrowLeftArrowRightArrowRightArrowUpArrowUpArrowDownArrowDown"
  user: User;
  pressedKeys: string[] = [];
  isShowHeader$: Observable<boolean>;
  admin$: Observable<boolean>;
  private isAdminMode: boolean = false;


  constructor(private swUpdate: SwUpdate, private userService: UserService, private storeUserService: StoreUserService,
              private router: Router) {

    this.swUpdate.versionUpdates.subscribe(version => {
      if (version.type === "VERSION_READY") window.location.reload();
    })
    this.admin$ = this.storeUserService.observeIsAdmin().pipe(startWith(false));
  }

  @HostListener('window:keyup', ['$event']) onKeyUp(e: KeyboardEvent) {
    this.pressedKeys.push(e.code);
    if (this.pressedKeys.length === 8) {
      if (this.pressedKeys.join('') === this.secretCode) {
        this.isAdminMode = !this.isAdminMode;
        this.storeUserService.saveIsAdmin(this.isAdminMode);
        if (!this.isAdminMode) this.router.navigate(['/']);
      }
      this.pressedKeys.splice(0, 1);
    }
  }

  ngOnInit() {
    this.router.events.subscribe(x => {
      if(x instanceof NavigationEnd)
      {
        window.scrollTo(0, 0);
      }
    });

    this.isShowHeader$ = this.storeUserService.observeIsLoggedIn().pipe(
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          return this.storeUserService.observeUser().pipe(
            map(user => user?.choice === Choice.P)
          );
        } else {
          return of(false);
        }
      })
    )
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}

