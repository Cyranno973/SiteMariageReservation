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
  // @Output() formChange: EventEmitter<any> = new EventEmitter();
  dishes: string[] = [];
  categories = ['Adulte', 'Enfant'];
  ngOnInit() {
   if(this.form.get('menu')?.value) {
     this.populateMenus();
   }

  }

  populateMenus(){
    this.dishes = this.form.get('selectedCategory')?.value === 'Enfant'? [Menu.Child] : [Menu.Fish, Menu.Meat];
  }

  onCategoryChange() {
    console.log('ttaa')
    this.populateMenus();

    if (this.form.get('selectedCategory')?.value === 'Enfant') {
      this.form.patchValue({
        menu: Menu.Child
      });
    } else {
      this.form.patchValue({
        menu: ''
      });
    }}
}
