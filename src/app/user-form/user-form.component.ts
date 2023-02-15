import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {Menu} from "../../model/User";

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent {
  @Input() form: FormGroup;
  @Output() selectedDish = new EventEmitter<string>();
  menu = Object.values(Menu);
}
