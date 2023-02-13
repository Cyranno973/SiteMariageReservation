import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";
import {MatDialog} from "@angular/material/dialog";
import {animate, style, transition, trigger} from "@angular/animations";
import {StoreUserService} from "../services/store-user.service";
import {Choice, Status, User} from "../../model/User";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";

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


export class HomeComponent implements OnInit, OnDestroy {
  constructor( private router:Router ,private userService: UserService, private dialogUser: MatDialog, private fb: FormBuilder, private storeUserService: StoreUserService) {
  }
  private subscribe: Subscription = new Subscription();

  userList: User[] | undefined;
  inputBillet: string = '';
  errorFormulaire: boolean = false;
  isLoggedIn: boolean = false;
  user: User;
  form: FormGroup = this.fb.group({
    numero: ['', [Validators.required, Validators.minLength(6)]]
  })

  ngOnInit() {
    console.log('%c salut', 'font-size:50px;')
   this.subscribe.add(this.storeUserService.observeUser().subscribe(user => this.user = user))
    this.storeUserService.observeUserList().subscribe(users => this.userList = users)
    this.storeUserService.observeIsLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if(this.user) {
        this.form.setValue({numero: this.user.id})
        this.updateData()
      }
    })
  }


  submit($event: Event) {
    const inputElt = $event.target as HTMLInputElement;
    this.inputBillet = inputElt.value;
    const reg = new RegExp('^[0-9]*$');
    if (reg.test(this.inputBillet) && this.inputBillet.length === 6) this.checkUserExist();
     else this.errorFormulaire = true;
  }

  private checkUserExist() {
    this.userService.getById(this.inputBillet).subscribe(user => {
      console.log('user rec', user.data())
      if (!user.exists) this.errorFormulaire = true
      else {
        this.user = user.data();
        this.storeUserService.saveIsLoggedIn(true);
        this.updateData();
      }
    })
  }
  updateData(){
      console.log('il exist', this.user)
      this.form.disable();
      this.errorFormulaire = false;
      this.checkUserStatus();
      this.storeUserService.saveUser(this.user);
}
  private checkUserStatus() {
    console.log('checkUserStatus', this.user.statusUser)
    switch (this.user.statusUser) {
      case Status.First :
        console.log('Never')
        this.user.statusUser = Status.Incomplete;
        this.userService.createOrUpdate(this.user)
        break;

      case Status.Present :
        console.log('Present')
        this.user.choice = Choice.P;
        break;

      case Status.Incomplete :
        console.log('Incomplet')
        break;

      case Status.Absent :
        console.log('Absent')
        this.user.choice = Choice.A;
        break;
    }
  }

  presentBtn() {
    this.user.statusUser = Status.Incomplete;
    this.user.choice = Choice.P;
    this.userService.createOrUpdate(this.user);
    this.storeUserService.saveUser(this.user);
    this.router.navigate(['/userForm']);

  }

  absBtn() {
    this.user.statusUser = Status.Absent;
    this.user.choice = Choice.A;
    delete this.user.menu;
    delete this.user.accompaniement;
    console.log(this.user)
    this.userService.createOrUpdate(this.user);
    this.storeUserService.saveUser(this.user);
  }

  modifBtn() {
    this.user.choice = Choice.All;
  }
  ngOnDestroy() {
    this.subscribe?.unsubscribe();
  }
}
