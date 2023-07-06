import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {User} from "../../../model/user";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  constructor() {
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
