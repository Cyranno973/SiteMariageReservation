import {ChangeDetectionStrategy, Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Personne, Status, User} from "../../model/user";
import {StoreUserService} from "../services/store-user.service";
import {UserService} from "../services/user.service";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent implements OnInit {
  userForm: FormGroup;
  oldForm: string = '';
  user: User;

  constructor(private fb: FormBuilder,
              private storeUserService: StoreUserService,
              private userService: UserService,
              private el: ElementRef,
              private renderer: Renderer2,
  ) {
  }


  ngOnInit() {
    this.storeUserService.observeUser().subscribe(user => {
      this.user = user;
      console.log({...user})
      console.log(user.menu)
      console.log(user.tel)
      console.log(user.selectedCategory)
      const t = {menu: this.user.menu, allergie: this.user.allergie || '', guests: this.user.accompaniement};
      this.oldForm = JSON.stringify(t);

      this.userForm = this.fb.group({
        name: [this.user.name, [Validators.minLength(2), Validators.pattern(/^\S.*\S$/)]],
        username: [this.user.username, [Validators.minLength(2), Validators.pattern(/^\S.*\S$/)]],
        tel: [this.user.tel, [Validators.pattern(/^\d+$/)]],
        menu: [this.user.menu || '', Validators.required],
        allergie: [this.user.allergie || ''],
        selectedCategory: [this.user.selectedCategory || '', Validators.required],
        guests: this.fb.array([]),
      }, {validators: this.menuValidator});

      if (this.user.accompaniement?.length) this.user.accompaniement.map(x => this.addGuest(x));
      this.userForm.controls['name'].disable();
      this.userForm.controls['username'].disable();
      this.userForm.controls['tel'].disable();
      this.userForm.valueChanges.pipe(
        debounceTime(300) // Attend 300ms après la dernière frappe
      ).subscribe(() => {
        if (this.userForm.dirty && this.userForm.valid) {
          console.log("valide");
          this.save();
        } else {
          console.log("non valide");
        }
      });
    });
  }

  menuValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const selectedCategory = control.get('selectedCategory');
    const menu = control.get('menu');

    if (selectedCategory && menu) {
      if (selectedCategory.value === 'Enfant' && ['Menu enfant'].indexOf(menu.value) < 0) {
        return {'invalidMenu': true};
      }

      if (selectedCategory.value === 'Adulte' && ['Viande', 'Poisson'].indexOf(menu.value) < 0) {
        return {'invalidMenu': true};
      }
    }

    return null;
  }

  save() {
    if (this.userForm.valid) {
      this.oldForm = JSON.stringify(this.userForm.value);
      this.user.menu = this.userForm.value.menu;
      this.user.allergie = this.userForm.value.allergie?.length ? this.userForm.value.allergie : '';
      this.user.statusUser = Status.Complete;
      this.user.selectedCategory = this.userForm.value.selectedCategory;
      this.user.accompaniement = this.userForm.value.guests as Personne[];

      this.userService.createOrUpdate(this.user);
      this.storeUserService.saveUser(this.user);

      this.userForm.markAsPristine();//  Cool Marque le formulaire comme non modifié (pristine)
    }
  }

  scrollToElement(element: HTMLElement) {
    this.renderer.selectRootElement(element).scrollIntoView({behavior: 'smooth', block: 'start'});
  }

  trackByFn(index: number, item: FormGroup): number {
    return index; // Utilisation de l'index comme identifiant unique pour chaque invité
  }

  get guests() {
    return this.userForm.get('guests') as FormArray;
  }

  addGuest(user?: Personne) {
    console.log(this.userForm)
    const invite = this.fb.group({
      name: [user?.name, [Validators.minLength(2), , Validators.pattern(/^\S.*\S$/), Validators.required]],
      username: [user?.username, [Validators.minLength(2), , Validators.pattern(/^\S.*\S$/), Validators.required]],
      tel: [''],
      allergie: [user?.allergie || ''],
      selectedCategory: [user?.selectedCategory || '', Validators.required],
      menu: [user?.menu || '', Validators.required],
    }, {validators: this.menuValidator});
    this.guests.push(invite);
    setTimeout(() => {
      const lastGuestElement = this.el.nativeElement.querySelector('.form-container__guest-form-container:last-child');
      if (lastGuestElement) {
        this.scrollToElement(lastGuestElement);
      }
    });
  }

  removeGuest(i: number) {
    this.guests.removeAt(i);
    this.user.accompaniement = this.user.accompaniement?.filter((x, index) => index !== i);
    if (JSON.stringify(this.userForm.value) === this.oldForm) return
    this.oldForm = JSON.stringify(this.userForm.value);
    this.userService.createOrUpdate(this.user);
    this.storeUserService.saveUser(this.user)
  }

  generateFormGroups(): FormGroup[] {
    const formArray = this.userForm.get('guests') as FormArray
    const formGroups = formArray.controls as FormGroup[];
    return formGroups;
  }
}
