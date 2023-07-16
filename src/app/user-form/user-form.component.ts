import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {Menu} from "../../model/user";

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserFormComponent {
  @Input() form: FormGroup;
  @Input() index: number;
  @Output() selectedDish = new EventEmitter<string>();
  menu = Object.values(Menu);
}
