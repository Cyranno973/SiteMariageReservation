import {Component, ElementRef, HostListener, OnInit, Renderer2} from '@angular/core';
import {Choice, User} from "../model/user";
import {UserService} from "./services/user.service";
import {StoreUserService} from "./services/store-user.service";
import {Router, RouterOutlet} from "@angular/router";

import {of, switchMap} from 'rxjs';
import {map} from 'rxjs/operators';
import {SwUpdate} from "@angular/service-worker";
import {routeAnimations} from "./route-animations";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimations],
})
export class AppComponent implements OnInit {
  // }
  pressedKeys: string[] = [];
  showNewPage: boolean = false;

  @HostListener('window:keyup', ['$event']) onKeyUp(e: KeyboardEvent) {
    this.pressedKeys.push(e.code)
    // console.log(this.pressedKeys)
    if (this.pressedKeys.length === 8) {
      if (this.pressedKeys.join('') === this.secretCode) {
        this.admin = !this.admin;
        this.storeUserService.saveIsAdmin(this.admin);
        if (this.admin) {
          //console.log('mode admin')
        }
        else {
         // console.log('mode user')
          this.router.navigate(['/']);
        }

      }
      this.pressedKeys.splice(0, 1);
    }
  }


  // @HostListener('window:resize', ['$event'])
  // onResize(event:any) {
  //   const body = this.elementRef.nativeElement.style.setProperty('--innerHeight', event.target.innerHeight+'px');
    // setTimeout(() =>  alert(event.target.innerHeight),3000)

    // this.renderer.setStyle(body, 'height', event.target.innerHeight+'px');

  constructor(private swUpdate: SwUpdate, private userService: UserService, private storeUserService: StoreUserService,
              private router: Router, private renderer: Renderer2,
              private elementRef: ElementRef) {
    this.swUpdate.versionUpdates.subscribe(version => {
      // console.log(version);
      if(version.type === "VERSION_READY"){
        window.location.reload();
      }
    })

  }
  secretCode: string = "ArrowLeftArrowLeftArrowRightArrowRightArrowUpArrowUpArrowDownArrowDown"
  admin: boolean = false;
  // userList?: any[];
  user: User;
  isShowHeader: boolean

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  ngOnInit() {



    // window.innerHeight
    this.storeUserService.observeIsLoggedIn().pipe(
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          return this.storeUserService.observeUser().pipe(
            map(user => user?.choice === Choice.P)
          );
        } else {
          return of(false);
        }
      })
    ).subscribe(isShowHeader => {
      this.isShowHeader = isShowHeader;
    });

    this.storeUserService.observeIsAdmin().subscribe(isAdmin => {
      this.admin = isAdmin;
    });
  }

}

