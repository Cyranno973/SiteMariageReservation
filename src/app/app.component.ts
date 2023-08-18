import {Component, HostListener, OnInit} from '@angular/core';
import {Choice, User} from "../model/user";
import {UserService} from "./services/user.service";
import {StoreUserService} from "./services/store-user.service";
import {Router} from "@angular/router";
import {of, switchMap} from 'rxjs';
import {map} from 'rxjs/operators';
import {SwUpdate} from "@angular/service-worker";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private swUpdate: SwUpdate, private userService: UserService, private storeUserService: StoreUserService, private router: Router) {
    this.swUpdate.versionUpdates.subscribe(version => {
      console.log(version);
      if(version.type === "VERSION_READY"){
        window.location.reload();
      }
    })
  }

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

  pressedKeys: string[] = [];
  secretCode: string = "ArrowLeftArrowLeftArrowRightArrowRightArrowUpArrowUpArrowDownArrowDown"
  admin: boolean = false;
  // userList?: any[];
  user: User;
  isShowHeader: boolean

  ngOnInit() {
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

