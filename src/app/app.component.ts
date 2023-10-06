import {Component, HostListener, OnInit} from '@angular/core';
import {Choice, User} from "../model/user";
import {StoreUserService} from "./services/store-user.service";
import {NavigationEnd, Router, RouterOutlet} from "@angular/router";

import {Observable, of, switchMap} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {SwUpdate} from "@angular/service-worker";
import {routeAnimations} from "./route-animations";
import {VersionService} from "./services/version.service";
import platform from 'platform';
import {AngularFireMessaging} from "@angular/fire/compat/messaging";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimations],
})
export class AppComponent implements OnInit {
  scrollPosition: number = 0;

  // Écouteur d'événement pour le défilement sur la fenêtre
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    // Obtenez la position de défilement actuelle
    this.scrollPosition = window.scrollY;
    console.log('Position de défilement :', this.scrollPosition);
  }

  secretCode: string = "ArrowLeftArrowLeftArrowRightArrowRightArrowUpArrowUpArrowDownArrowDown"
  user: User;
  pressedKeys: string[] = [];
  isShowHeader$: Observable<boolean>;
  admin$: Observable<boolean>;
  private isAdminMode: boolean = false;

  constructor(private swUpdate: SwUpdate, private storeUserService: StoreUserService, private versionService: VersionService,
              private router: Router, private afMessaging: AngularFireMessaging
  ) {
    this.swUpdate.versionUpdates.subscribe(version => {
      if (version.type === "VERSION_READY") window.location.reload();
    })
    this.admin$ = this.storeUserService.observeIsAdmin().pipe(startWith(false));
    this.afMessaging.messages.subscribe((message) => console.log('Received message:', message));

  }

  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    console.log('[scroll]', scrollPosition);
  }

  @HostListener('window:keyup', ['$event']) onKeyUp(e: KeyboardEvent) {
    this.pressedKeys.push(e.code);
    if (this.pressedKeys.length === 8) {
      if (this.pressedKeys.join('') === this.secretCode) {
        this.isAdminMode = !this.isAdminMode;
        this.storeUserService.saveIsAdmin(this.isAdminMode);
        if (!this.isAdminMode) {
          this.storeUserService.clearUser();
          this.storeUserService.saveIsLoggedIn(false);
          localStorage.removeItem('billet');
          this.router.navigate(['/']);
        } else this.router.navigate(['/admin']);
      }
      this.pressedKeys.splice(0, 1);
    }
  }

  ngOnInit() {
    this.router.events.subscribe(x => {
      if (x instanceof NavigationEnd) {
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

  showVersion() {
    alert(`Version actuelle: ${this.versionService.version}, ${platform.description}, ${platform.os}`);
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
