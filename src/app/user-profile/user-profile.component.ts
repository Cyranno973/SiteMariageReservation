import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Personne, Status, User} from "../../model/user";
import {StoreUserService} from "../services/store-user.service";
import {UserService} from "../services/user.service";

import {ToastrService} from "ngx-toastr";
import {debounceTime} from "rxjs";
import {debounce} from 'lodash';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnInit {
  userForm: FormGroup;
  oldForm: string = '';
  user: User;

  private debouncedSave = debounce(() => this.actualSave(), 1000);

  constructor(private fb: FormBuilder,
              private storeUserService: StoreUserService,
              private userService: UserService,
              private toastr: ToastrService,
  ) {
  }

  ngOnInit() {
    this.storeUserService.observeUser().subscribe(user => {
      this.user = user;
      const t = {menu: this.user?.menu, allergie: this.user?.allergie || '', guests: this.user?.accompaniement};
      this.oldForm = JSON.stringify(t);

      this.userForm = this.fb.group({
        name: [this.user?.name, [Validators.minLength(2), this.noWhitespaceValidator]],
        username: [this.user?.username, [Validators.minLength(2)]],
        tel: [this.user?.tel, [Validators.pattern(/^\d+$/)]],
        menu: [this.user?.menu || '', Validators.required],
        allergie: [this.user?.allergie || ''],
        selectedCategory: [this.user?.selectedCategory || '', Validators.required],
        guests: this.fb.array([]),
      }, {validators: this.menuValidator});

      if (this.user?.accompaniement?.length) this.user.accompaniement.map(x => this.addGuest(x));
      this.userForm.controls['name'].disable();
      this.userForm.controls['username'].disable();
      this.userForm.controls['tel'].disable();
      // this.userForm.controls['selectedCategory'].disable();
      this.userForm.valueChanges.pipe(
        debounceTime(300) // Attend 300ms après la dernière frappe
      ).subscribe(() => {
        if (this.userForm.dirty && this.userForm.valid) {
          //console.log("valide");
          this.save();
        } else {
          //console.log("non valide");
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

  noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value && control.value.trim() === '') {
      return {'whitespace': true};
    }
    return null;
  }

  save() {
    this.debouncedSave();
  }

  actualSave() {
    if (this.userForm.valid) {
      this.oldForm = JSON.stringify(this.userForm.value);
      this.user.menu = this.userForm.value.menu;
      this.user.allergie = this.userForm.value.allergie?.length ? this.userForm.value.allergie : '';
      this.user.statusUser = Status.Complete;
      this.user.selectedCategory = this.userForm.value.selectedCategory;
      this.user.accompaniement = this.userForm.value.guests as Personne[];

      this.userService.createOrUpdate(this.user).then(() => {
        // Notification après confirmation de Firebase
        this.toastr.success('Formulaire enregistré avec succès !');

      }).catch(() => {
        // Notification en cas d'erreur
        this.toastr.error('Erreur lors de l\'enregistrement du formulaire.');
      });
      this.storeUserService.saveUser(this.user);

      this.userForm.markAsPristine();//  Cool Marque le formulaire comme non modifié (pristine)
    }
  }

  trackByFn(index: number): number {
    return index; // Utilisation de l'index comme identifiant unique pour chaque invité
  }

  get guests() {
    return this.userForm.get('guests') as FormArray;
  }

  addGuest(user?: Personne) {
    //console.log(this.userForm)
    const invite = this.fb.group({
      name: [user?.name, [Validators.minLength(2), Validators.required, this.noWhitespaceValidator]],
      username: [user?.username, [Validators.minLength(2), Validators.required, this.noWhitespaceValidator]],
      tel: [''],
      allergie: [user?.allergie || ''],
      selectedCategory: [user?.selectedCategory || '', Validators.required],
      menu: [user?.menu || '', Validators.required],
    }, {validators: this.menuValidator});
    this.guests.push(invite);
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
    return formArray.controls as FormGroup[];
  }
}
