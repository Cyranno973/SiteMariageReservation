import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Choice, Menu, Personne, Status, User} from "../../model/user";
import {StoreUserService} from "../services/store-user.service";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userForm: FormGroup;
  oldForm: string = '';
  user: User;
  // userTest: User = { //TODO A SUPPRIMMER
  //   menu: Menu.Fish,
  //   username: "steve",
  //   statusUser: Status.First,
  //   choice: Choice.P,
  //   name: "gouin",
  //   id: "568347",
  //   "accompaniement": [
  //     // {
  //     //   allergie: "",
  //     //   name: "zeze",
  //     //   menu: Menu.Fish,
  //     //   username: "zezez"
  //     // },
  //   ]
  // }
  constructor(private fb: FormBuilder, private storeUserService: StoreUserService, private userService: UserService) {
  }


  ngOnInit() {
    this.storeUserService.observeUser().subscribe(user => {
      this.user = user;
      console.log({...user})
      console.log(user.menu)
      console.log(user.selectedCategory)
      const t = { menu: this.user.menu, allergie: this.user.allergie || '', guests: this.user.accompaniement };
      this.oldForm = JSON.stringify(t);

      this.userForm = this.fb.group({
        name: [this.user.name , [Validators.minLength(3)]],
        username: [this.user.username , [Validators.minLength(3)]],
        tel: [ this.user.tel ],
        menu: [ this.user.menu || '', Validators.required],
        allergie: [ this.user.allergie || ''],
        selectedCategory: [this.user.selectedCategory || ''],
        guests: this.fb.array([]),
      }, { validators: this.menuValidator });

      if (this.user.accompaniement?.length) this.user.accompaniement.map(x => this.addGuest(x));
      this.userForm.controls['name'].disable();
      this.userForm.controls['username'].disable();
      this.userForm.controls['tel'].disable();
      this.userForm.valueChanges.subscribe(() => {
        if (this.userForm.dirty && this.userForm.valid) {
          console.log("valide");
          this.checkMenu();
          // console.log(this.userForm.value)
          this.save();
        }else{
          console.log("non valide");}
      });
    });
  }
   menuValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const selectedCategory = control.get('selectedCategory');
    const menu = control.get('menu');

    if (selectedCategory && menu) {
      if (selectedCategory.value === 'Enfant' && ['Menu enfant'].indexOf(menu.value) < 0) {
        return { 'invalidMenu': true };
      }

      if (selectedCategory.value === 'Adulte' && ['Viande', 'Poisson'].indexOf(menu.value) < 0) {
        return { 'invalidMenu': true };
      }
    }

    return null;
  }

checkMenu(){
  console.log(this.userForm.get('menu')?.value);
  console.log(this.userForm.get('selectedCategory')?.value);
  // if()
}

  save() {
    if (this.userForm.valid) {

      // if (JSON.stringify(this.userForm.value) === this.oldForm) return

      this.oldForm = JSON.stringify(this.userForm.value);
      // const newUser = {...this.user};
      // console.log(newUser);
      this.user.menu = this.userForm.value.menu;
      this.user.allergie = this.userForm.value.allergie?.length ? this.userForm.value.allergie: '';
      this.user.statusUser = Status.Complete;
      this.user.selectedCategory = this.userForm.value.selectedCategory;
      this.user.accompaniement = this.userForm.value.guests as Personne[];

      this.userService.createOrUpdate(this.user);
      this.storeUserService.saveUser(this.user);

      this.userForm.markAsPristine();// Marque le formulaire comme non modifié (pristine)
    }
  }

  get guests() {
    return this.userForm.get('guests') as FormArray;
  }

  addGuest(user?: Personne) {
    console.log(this.userForm)
    const invite = this.fb.group({
      name: [user?.name, [Validators.minLength(3), Validators.required]],
      username: [user?.username, [Validators.minLength(3), Validators.required]],
      allergie: [user?.allergie || ''],
      menu: [user?.menu || '', Validators.required],
      tel: [],
    });
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
    const formGroups = formArray.controls as FormGroup[];
    return formGroups;
  }

  // saveForm() {
  //   console.log('change fonctionne');
  //   this.save();
  // }
}
