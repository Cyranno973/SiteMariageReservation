import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";
import {MatDialog} from "@angular/material/dialog";
import {animate, style, transition, trigger} from "@angular/animations";
import {StoreUserService} from "../services/store-user.service";
import {Choice, Menu, Status, User} from "../../model/user";
import {Router} from "@angular/router";
import {Subject, Subscription, takeUntil} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  // encapsulation: ViewEncapsulation.None,

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
  constructor(private router: Router, private userService: UserService, private dialogUser: MatDialog, private fb: FormBuilder, private storeUserService: StoreUserService) {
  }

  private unsubscribe$ = new Subject<void>();
  userList: User[] | undefined;
  inputBillet: string = '';
  errorFormulaire: boolean = false; //TODO faire un validator personnalisé et supprimer cette variable
  showModifChoice: boolean = false;
  isLoggedIn: boolean = false;
  // userTest: User = { //TODO A SUPPRIMMER
  //   menu: Menu.Fish,
  //   username: "steve",
  //   statusUser: Status.First,
  //   choice: Choice.P,
  //   name: "gouin",
  //   id: "568347",
  //   "accompaniement": [
  //     {
  //       allergie: "",
  //       name: "zeze",
  //       menu: Menu.Fish,
  //       username: "zezez"
  //     },
  //     {
  //       allergie: "",
  //       name: "zeze",
  //       menu: Menu.Fish,
  //       username: "zezez"
  //     }
  //   ]
  // }
  @Input() user: User;
  form: FormGroup = this.fb.group({
    numero: ['', [Validators.required, Validators.minLength(6)]]
  })

  ngOnInit() {
    this.storeUserService.observeUser().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(user => this.user = user);

    this.storeUserService.observeUserList().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(users => this.userList = users);

    this.storeUserService.observeIsLoggedIn().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (this.user) {
        this.form.setValue({ numero: this.user.id });
        this.updateData();
      }
    });
  }


  submit(event: Event) {
    const inputElt = event.target as HTMLInputElement;
    this.inputBillet = inputElt.value;

    if (this.inputBillet === '102030') {
      this.storeUserService.saveIsAdmin(true);
      console.log('admin true')
      this.router.navigate(['/admin']);
      return;
    }

    const reg = new RegExp('^[0-9]*$');
    if (reg.test(this.inputBillet) && this.inputBillet.length === 6) this.checkUserExist();
    else this.errorFormulaire = true;
  }

  private checkUserExist() {
    this.userService.getById(this.inputBillet).subscribe(user => {
      if (!user.exists) this.errorFormulaire = true
      else {
        this.user = user.data();
        this.storeUserService.saveIsLoggedIn(true);
        this.updateData();
      }
    })
  }

  updateData() {
    console.log('il exist', this.user)
    this.form.disable();
    this.errorFormulaire = false;
    // if (this.user.statusUser === Status.First) {
    //   this.user.statusUser = Status.Incomplete;
      // this.userService.createOrUpdate(this.user);
    // }
    // this.storeUserService.saveUser(this.user);
  }

  btnChoice(choice: string) {
    if (choice === 'p') {
      this.user.statusUser = Status.Incomplete;
      this.user.choice = Choice.P;
      this.userService.createOrUpdate(this.user);
      this.storeUserService.saveUser(this.user);
      // console.log(this.user)

    } else {
      this.user.statusUser = Status.Complete;
      this.user.choice = Choice.A;
      delete this.user.menu;
      delete this.user.allergie;
      this.user.accompaniement = [];
      // console.log(this.user)
      this.userService.createOrUpdate(this.user);
      this.storeUserService.saveUser(this.user);
    }
    this.showModifChoice = false;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
