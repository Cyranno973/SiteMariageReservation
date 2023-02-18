import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StoreUserService} from "../../services/store-user.service";
import {UserService} from "../../services/user.service";
import {User} from "../../../model/User";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  constructor(private fb: FormBuilder, private storeUserService: StoreUserService, private userService: UserService) {
  }
  @Input() userForm: FormGroup;
  user: User;
  @Input() UserToUpdate: User;
  @Input() updateBtn: boolean;

  @Output() userToSave: EventEmitter<string> = new EventEmitter<string>();
  @Output() userToUpdate: EventEmitter<User> = new EventEmitter<User>();

  save() {
    this.userToSave.emit(this.userForm.value.id);
  }

  update() {
    this.userToUpdate.emit(this.userForm.value);
  }
}
