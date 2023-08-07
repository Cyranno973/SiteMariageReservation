import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from "@angular/core";
import {FormGroup} from "@angular/forms";
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
  menu = Object.values(Menu);
  dishes: string[] = [];
  categories = ['Adulte', 'Enfant'];
  @Output() formChange: EventEmitter<any> = new EventEmitter<any>();
  ngOnInit() {
   if(this.form.get('menu')?.value) this.populateMenus();
  }

  populateMenus(){
    this.dishes = this.form.get('selectedCategory')?.value === 'Enfant'? [Menu.Child] : [Menu.Fish, Menu.Meat];
  }

  onCategoryChange() {
    this.populateMenus();
    if (this.form.get('selectedCategory')?.value === 'Enfant') this.form.get('menu')?.setValue(Menu.Child);
    else this.form.get('menu')?.setValue('');
  }
}
