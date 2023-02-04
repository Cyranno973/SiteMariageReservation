import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {UserService} from "../services/user.service";
import {MatDialog} from "@angular/material/dialog";
import {animate, style, transition, trigger} from "@angular/animations";
import {StoreUserService} from "../services/store-user.service";
import {Status, User} from "../../model/User";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],

  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({opacity: 0}),
            animate('5s ease-out',
              style({opacity: 1}))
          ]
        ),
        transition(
          ':leave',
          [
            style({height: 300, opacity: 1}),
            animate('1s ease-in',
              style({height: 0, opacity: 0}))
          ]
        )
      ]
    )
  ]
})


export class HomeComponent implements OnInit {
  constructor(private userService: UserService, private dialogUser: MatDialog, private fb: FormBuilder, private storeUserService: StoreUserService) {
  }

  userList: User[] | undefined;
  inputBillet: string = '';
  participation: boolean = false;
  errorFormulaire: boolean = false;
  isLoggedIn: boolean = false;
  absent: boolean = false;
  user: User;
  @ViewChild('span', {static: true}) span: ElementRef | undefined;

  subscription: Subscription = new Subscription();
  form: FormGroup = this.fb.group({
    numero: ['']
  })

  ngOnInit() {
    console.log('%c salut', 'font-size:50px;')
    this.storeUserService.observeUserList().subscribe(users => this.userList = users)
    this.storeUserService.observeIsloged().subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn)
  }


  submit($event: Event) {
    const inputElt = $event.target as HTMLInputElement;
    this.inputBillet = inputElt.value;
    const reg = new RegExp('^[0-9]*$');
    if (reg.test(this.inputBillet) && this.inputBillet.length === 6) {
       this.userService.getById(this.inputBillet).subscribe(user => {
        if(!user.exists) this.errorFormulaire = true
        this.user = user.data();
         this.form.disable()
           this.errorFormulaire = false;
           this.storeUserService.storeIsLoggedIn.next(true)
         this.user.statusUser = Status.Incomplet;
         // this.userService.update(this.user.id, this.user)
      })
    }
  }

  presentBtn() {
    this.storeUserService.storeParticipe.next(true)
    this.participation = !this.participation;
  }

  absBtn() {
    this.absent = true;
  }

  modifBtn() {
    this.absent = false
    // this.form.enable();
  }
}
