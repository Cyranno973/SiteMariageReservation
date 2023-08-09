import {Component, Input, OnInit, ViewEncapsulation} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {Menu} from "../../model/user";

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() index: number;
  dishes: string[] = [];
  categories = ['Adulte', 'Enfant'];

  ngOnInit()  {
    if (this.form.get('menu')?.value) this.populateMenus();
  }

  onCategoryChange() {
    this.populateMenus();
    const menu = this.form.get('selectedCategory')?.value === 'Enfant' ? Menu.Child : '';
    this.form.get('menu')?.setValue(menu);
  }

  private populateMenus = () => this.dishes = this.form.get('selectedCategory')?.value === 'Enfant' ? [Menu.Child] : [Menu.Fish, Menu.Meat];
}
