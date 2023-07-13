import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
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
  userTest: User = { //TODO A SUPPRIMMER
    menu: Menu.Fish,
    username: "steve",
    statusUser: Status.First,
    choice: Choice.P,
    name: "gouin",
    id: "568347",
    "accompaniement": [
      {
        allergie: "",
        name: "zeze",
        menu: Menu.Fish,
        username: "zezez"
      },
      {
        allergie: "",
        name: "zeze",
        menu: Menu.Fish,
        username: "zezez"
      }
    ]
  }
  constructor(private fb: FormBuilder, private storeUserService: StoreUserService, private userService: UserService) {
  }

  ngOnInit() {
    this.storeUserService.observeUser().subscribe(user => {
      this.user = this.userTest; //TODO this.user = user
      const t = { menu: this.user.menu,  allergie: this.user.allergie || '', accompagnement: this.user.accompaniement}
      this.oldForm = JSON.stringify(t)

      this.userForm = this.fb.group({
        name: [this.user.name, [Validators.minLength(3)]],
        username: [this.user.username, [Validators.minLength(3)]],
        tel: [this.user.tel],
        menu: [this.user.menu || '', Validators.required],
        allergie: [this.user.allergie || '',],
        accompagnement: this.fb.array([]),
      });
      if (this.user.accompaniement?.length) this.user.accompaniement.map(x => this.addAccompaniement(x))
      this.userForm.controls['name'].disable()
      this.userForm.controls['username'].disable();
      this.userForm.controls['tel'].disable();
    })
  }

  save() {
    if (this.userForm.valid) {

      if (JSON.stringify(this.userForm.value) === this.oldForm) return

      this.oldForm = JSON.stringify(this.userForm.value)
      const newUser = {...this.user}
      newUser.menu = this.userForm.value.menu === Menu.Meat ? Menu.Meat : Menu.Fish;
      newUser.allergie = this.userForm.value.allergie?.length ? this.userForm.value.allergie: '';
      newUser.statusUser = Status.Complete;
      newUser.accompaniement = this.userForm.value.accompagnement as Personne[];
      this.userService.createOrUpdate(newUser)
      this.storeUserService.saveUser(newUser)
    }
  }

  get accompaniement() {
    return this.userForm.get('accompagnement') as FormArray;
  }

  addAccompaniement(user?: Personne) {
    const invite = this.fb.group({
      name: [user?.name, [Validators.minLength(3), Validators.required]],
      username: [user?.username, [Validators.minLength(3), Validators.required]],
      allergie: [user?.allergie || ''],
      menu: [user?.menu || '', Validators.required],
      tel: [],
    });
    this.accompaniement.push(invite);
  }

  removeGroupe(i: number) {
    this.accompaniement.removeAt(i);
    this.user.accompaniement = this.user.accompaniement?.filter((x, index) => index !== i);
    if (JSON.stringify(this.userForm.value) === this.oldForm) return
    this.oldForm = JSON.stringify(this.userForm.value);
    this.userService.createOrUpdate(this.user);
    this.storeUserService.saveUser(this.user)

  }

  formGroupeFake(): FormGroup[] {
    const formArray = this.userForm.get('accompagnement') as FormArray
    const formGroups = formArray.controls as FormGroup[];
    return formGroups;
  }
}
