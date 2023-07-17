import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {FormGroup, Validators} from "@angular/forms";
import {Menu} from "../../model/user";

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserFormComponent implements OnInit{
  @Input() form: FormGroup;
  @Input() index: number;
  // @Output() selectedDish = new EventEmitter<string>();
  menu = Object.values(Menu);

  ngOnInit(): void {
    console.log(this.index)
    this.form.get('menu')?.setValidators([Validators.required]);
  }
}
