import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";
import {MatDialog} from "@angular/material/dialog";
import {StoreUserService} from "../services/store-user.service";
import {Choice, Status, User} from "../../model/user";
import {Router} from "@angular/router";
import {Subject, takeUntil} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {AngularFireMessaging} from "@angular/fire/compat/messaging";
import {NotificationService} from "../services/notification.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})


export class HomeComponent implements OnInit, OnDestroy {
  billet: string;
  private unsubscribe$ = new Subject<void>();
  userList: User[] | undefined;
  inputBillet: string = '';
  errorFormulaire: boolean = false; //TODO faire un validator personnalisé et supprimer cette variable
  showModifChoice: boolean = false;
  isLoggedIn: boolean = false;
  admin: boolean;
  ok: boolean = false;
  user: User;

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    // Votre code de gestion du défilement ici
    console.log('aaa')
  }

  constructor(private router: Router,
              private userService: UserService,
              private toastr: ToastrService,
              private dialogUser: MatDialog,
              private fb: FormBuilder,
              private storeUserService: StoreUserService,
              private afMessaging: AngularFireMessaging,
              private notificationService: NotificationService
  ) {
    if (localStorage.getItem('billet')) this.billet = localStorage.getItem('billet') as string;
    this.afMessaging.messages.subscribe((message) => console.log('Received message:', message));
  }
  form: FormGroup = this.fb.group({
    numero: ['', [Validators.required, Validators.minLength(6)]]
  })
  first: boolean = true;

  ngOnInit() {
    this.submit();
    this.storeUserService.observeUser().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(user => this.user = user);
    this.storeUserService.observeIsAdmin().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(admin => {
      this.admin = admin;
      if (this.admin) {
        this.form?.disable();
      }
    });
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

  submit(event?: Event) {
    const inputElt = event?.target as HTMLInputElement;
    if (this.billet) this.inputBillet = this.billet;
    else if (inputElt?.value) this.inputBillet = inputElt.value;
    else { return }

    if (this.inputBillet === '102030') {
      this.storeUserService.saveIsAdmin(true);
      this.form.reset();
      this.form?.disable();
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
    this.form?.disable();
    this.errorFormulaire = false;
    if (this.user.statusUser === Status.First) {
      this.user.statusUser = Status.Incomplete;
      this.user.selectedCategory = "Adulte";
      this.userService.createOrUpdateUser(this.user)
        // .then((user) => this.toastr.success(`Bienvenue ${user.username}`, 'Notification'));
    }
    this.storeUserService.saveUser(this.user);
    localStorage.setItem('billet', this.user.id);
  }

  btnChoice(choice: string) {
    if (choice === 'p') {
      this.user.statusUser = Status.Incomplete;
      this.user.choice = Choice.P;
      this.user.selectedCategory = "Adulte";
      this.userService.createOrUpdateUser(this.user);
      this.storeUserService.saveUser(this.user);
      this.toastr.success('Nous serons ravis de vous voir et merci de votre présence !', 'Notification');
      this.requestPermission();
    } else {
      this.user.statusUser = Status.Complete;
      this.user.choice = Choice.A;
      delete this.user.menu;
      delete this.user.allergie;
      this.user.accompaniement = [];
      this.userService.createOrUpdateUser(this.user);
      this.storeUserService.saveUser(this.user);
      this.toastr.success('C’est dommage mais je sais que le coeur y est !', 'Notification', {
        positionClass: 'toast-top-center',
      });
    }
    this.showModifChoice = false;
  }

  noIncrementDecrementNumber(event: KeyboardEvent) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') event.preventDefault();
  }

  logout() {
    this.billet = '';
    this.form.reset();
    this.storeUserService.clearUser();
    this.storeUserService.saveIsLoggedIn(false);
    this.form?.enable();
    localStorage.removeItem('billet');
  }


  requestPermission() {
    this.afMessaging.requestToken
      .subscribe(
        (token) => {console.log('Permission granted! Save to the server!', token)},
        (error) => {console.error('Unable to get permission to notify.', error);}
      );
  }

  toggleNotification() {

    console.log('bonjour')
    if (this.user) {
    // this.toastr.success(this.user.name, 'Notification');
      this.notificationService.requestPermission(this.user).then(() => {
        this.ok = true;
        this.toastr.success('Vous aurez toute les news !', 'Notification');
      }).catch((error) => {
        this.toastr.error(error, 'Notification');
        console.error('Error saving token', error);
      });
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
