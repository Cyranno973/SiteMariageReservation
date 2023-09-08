import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";
import {MatDialog} from "@angular/material/dialog";
import {StoreUserService} from "../services/store-user.service";
import {Choice, Status, User} from "../../model/user";
import {Router} from "@angular/router";
import {Subject, takeUntil} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {AngularFireMessaging} from "@angular/fire/compat/messaging";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})


export class HomeComponent implements OnInit, OnDestroy {
  constructor(private router: Router,
              private userService: UserService,
              private toastr: ToastrService,
              private dialogUser: MatDialog,
              private fb: FormBuilder,
              private storeUserService: StoreUserService,
              private afMessaging: AngularFireMessaging
  ) {
    this.afMessaging.messages.subscribe((message) => {
      console.log('Received message:', message);
    });

  }

  private unsubscribe$ = new Subject<void>();
  userList: User[] | undefined;
  inputBillet: string = '';
  errorFormulaire: boolean = false; //TODO faire un validator personnalisé et supprimer cette variable
  showModifChoice: boolean = false;
  isLoggedIn: boolean = false;
  @Input() user: User;
  form: FormGroup = this.fb.group({
    numero: ['', [Validators.required, Validators.minLength(6)]]
  })
  first: boolean = true;

  ngOnInit() {
    // this.submit();
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
        this.form.setValue({numero: this.user.id});
        this.updateData();
      }
    });
  }

  submit(event?: Event) { // Todo retirer point d'interogation
    const inputElt = event?.target as HTMLInputElement; //TODO retirer point d'interogation
    this.inputBillet = inputElt.value; // Todo et remmettre
    // this.inputBillet = '568347'; // Todo supprimer

    if (this.inputBillet === '102030') {
      this.storeUserService.saveIsAdmin(true);
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
        this.first = false;
        this.user = user.data();
        this.storeUserService.saveIsLoggedIn(true);
        this.updateData();
      }
    })
  }

  updateData() {
    //// console.log('il exist', this.user)
    this.form?.disable();
    this.errorFormulaire = false;
    if (this.user.statusUser === Status.First) {
      this.user.statusUser = Status.Incomplete;
      this.user.selectedCategory = "Adulte";
      this.userService.createOrUpdate(this.user);
    }
    this.storeUserService.saveUser(this.user);
  }

  btnChoice(choice: string) {
    if (choice === 'p') {
      this.user.statusUser = Status.Incomplete;
      this.user.choice = Choice.P;
      this.user.selectedCategory = "Adulte";

      this.userService.createOrUpdate(this.user);
      this.storeUserService.saveUser(this.user);
      //console.log('show notif')
      this.toastr.success('Nous serons ravis de vous voir et merci de votre présence !', 'Notification');
      this.requestPermission();
      //// console.log(this.user)

    } else {
      this.user.statusUser = Status.Complete;
      this.user.choice = Choice.A;
      delete this.user.menu;
      delete this.user.allergie;
      this.user.accompaniement = [];
      //// console.log(this.user)
      this.userService.createOrUpdate(this.user);
      this.storeUserService.saveUser(this.user);
      this.toastr.success('C’est dommage mais je sais que le coeur y est !', 'Notification', {
        positionClass: 'toast-top-center',
      });

    }

    this.showModifChoice = false;
  }

  noIncrementDecrementNumber(event: KeyboardEvent) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  //   });
  requestPermission() {
    this.afMessaging.requestToken
      .subscribe(
        (token) => {
          console.log('Permission granted! Save to the server!', token);
        },
        (error) => {
          console.error('Unable to get permission to notify.', error);
        }
      );
  }

  // requestPermission() {
  //   // const messaging = getMessaging();
  //   getToken(messaging,
  //     { vapidKey: environment.firebase.vapidKey}).then(
  //     (currentToken) => {
  //       if (currentToken) {
  //         console.log("Hurraaa!!! we got the token.....");
  //         console.log(currentToken);
  //       } else {
  //         console.log('No registration token available. Request permission to generate one.');
  //       }
  //     }).catch((err) => {
  //     console.log('An error occurred while retrieving token. ', err);


}
