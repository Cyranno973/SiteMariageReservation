import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Personne, Status, User} from "../../model/user";
import {StoreUserService} from "../services/store-user.service";
import {UserService} from "../services/user.service";

import {ToastrService} from "ngx-toastr";
import {debounce} from 'lodash';
import {menuValidator, noWhitespaceValidator} from "./validators";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnInit {
  userForm: FormGroup;
  user: User;

  private debouncedSave = debounce(() => this.actualSave(), 300);

  constructor(private fb: FormBuilder,
              private storeUserService: StoreUserService,
              private userService: UserService,
              private toastr: ToastrService,
  ) {
  }

  ngOnInit() {
    this.storeUserService.observeUser().subscribe(user => {
      this.user = user;
      this.userForm = this.fb.group({
        name: [this.user?.name, [Validators.minLength(2), noWhitespaceValidator]],
        username: [this.user?.username, [Validators.minLength(2)]],
        tel: [this.user?.tel, [Validators.pattern(/^\d+$/)]],
        menu: [this.user?.menu || '', Validators.required],
        allergie: [this.user?.allergie || ''],
        selectedCategory: [this.user?.selectedCategory || '', Validators.required],
        guests: this.fb.array([]),
      }, {validators: menuValidator});

      if (this.user?.accompaniement?.length) this.user.accompaniement.map(x => this.addGuest(x));
      this.userForm.controls['name'].disable();
      this.userForm.controls['username'].disable();
      this.userForm.controls['tel'].disable();
      this.userForm.controls['selectedCategory'].disable();
    });
  }

  save() {
    this.debouncedSave();
  }

  actualSave(guest:boolean = false) {
    if (this.userForm.valid && this.userForm.dirty) {
      console.log('aa')
      this.user.menu = this.userForm.value.menu;
      this.user.allergie = this.userForm.value.allergie?.length ? this.userForm.value.allergie : '';
      this.user.statusUser = Status.Complete;
      this.user.accompaniement = this.userForm.value.guests as Personne[];
      this.userService.createOrUpdate(this.user).then(() => {
        // Notification après confirmation de Firebase
        const inviteName = this.user!.accompaniement![this.user!.accompaniement!.length-1].username;
        guest? this.toastr.success(`Invité ${inviteName} enregistré avec succès !`): this.toastr.success('Formulaire enregistré avec succès !');

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
    this.actualSave(true);

    //console.log(this.userForm)
    const invite = this.fb.group({
      name: [user?.name, [Validators.minLength(2), Validators.required, noWhitespaceValidator]],
      username: [user?.username, [Validators.minLength(2), Validators.required, noWhitespaceValidator]],
      tel: [''],
      allergie: [user?.allergie || ''],
      selectedCategory: [user?.selectedCategory || '', Validators.required],
      menu: [user?.menu || '', Validators.required],
    }, {validators: menuValidator});
    this.guests.push(invite);

  }

  removeGuest(i: number) {
    this.guests.removeAt(i);
    this.user.accompaniement = this.user.accompaniement?.filter((x, index) => index !== i);
    this.userService.createOrUpdate(this.user).then(() => this.toastr.success('Supression enregistré avec succès !'));
    this.storeUserService.saveUser(this.user)
  }

  generateFormGroups(): FormGroup[] {
    const formArray = this.userForm.get('guests') as FormArray
    return formArray.controls as FormGroup[];
  }
}
