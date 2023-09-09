import {Component, OnInit} from '@angular/core';
import {StoreUserService} from "../services/store-user.service";
import {User} from "../../model/user";
import {Observable} from "rxjs";

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss']
})
export class ProgramComponent implements OnInit {
  user$: Observable<User>;

  constructor(private userStore: StoreUserService) {

  }

  ngOnInit(): void {
    this.user$ = this.userStore.observeUser();

     // this.userStore.observeUser().subscribe((user:User) => console.log(user))
  }
}
