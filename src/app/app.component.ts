import {Component, HostListener, OnInit} from '@angular/core';
import {User} from "../model/User";
import {UserService} from "./services/user.service";
import {StoreUserService} from "./services/store-user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private userService: UserService, private storeUserService: StoreUserService, private router: Router) {
  }

  @HostListener('window:keyup', ['$event']) onKeyUp(e: KeyboardEvent) {
    this.pressedKeys.push(e.code)
    // console.log(this.pressedKeys)
    if (this.pressedKeys.length === 8) {
      if (this.pressedKeys.join('') === this.secretCode) {
        this.admin = !this.admin;
        this.storeUserService.saveIsAdmin(this.admin);
        if (this.admin) console.log('mode admin')
        else {
          console.log('mode user')
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

  ngOnInit() {
    this.storeUserService.observeUser().subscribe(user => this.user = user);
    this.storeUserService.observeIsAdmin().subscribe(isaAdmin => this.admin = isaAdmin);
  }
}

