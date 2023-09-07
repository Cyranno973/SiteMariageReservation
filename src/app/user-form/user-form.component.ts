import {AfterViewInit, Component, ElementRef, Input, ViewChild} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {Menu} from "../../model/user";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(-10px)'
      })),
      transition('void <=> *', animate(300))
    ])
  ]
})
export class UserFormComponent implements AfterViewInit {
  @Input() form: FormGroup;
  @Input() index: number;
  dishes: string[] = [];
  categories = ['Adulte', 'Enfant'];
  indentationCategory: string = '0';
  indentationValueMenu: string = '0';
  @ViewChild('selectContainer') selectContainer!: ElementRef;
  constructor() {
  }

  onCategoryChange() {
    this.populateMenus();
    const menu = this.form.get('selectedCategory')?.value === 'Enfant' ? Menu.Child : '';
    this.form.get('menu')?.setValue(menu);
  }

  ngAfterViewInit(): void {
    if (this.form?.get('menu')?.value) this.populateMenus();
  }

  private populateMenus = () => {
    const selectedCategory = this.form.get('selectedCategory')?.value;
    // console.log(selectedCategory);
    this.dishes = selectedCategory === 'Enfant' ? [Menu.Child] : [Menu.Fish, Menu.Meat];
    const parentWidth = this.selectContainer?.nativeElement.offsetWidth;
    console.log(parentWidth);
    // console.log(parentWidth);
    // console.log(this.form);
    if (selectedCategory === "Adulte"){
      // this.indentationCategory = "3em"
      // this.indentationCategory = "3em"
      this.indentationCategory = `${parentWidth / 2.7}px`;
      console.log(this.indentationCategory);
      if(this.form.get('menu')?.value === ''){

      this.indentationValueMenu = `36px`;
      }
    }else{
      this.indentationCategory = `${parentWidth / 6}px`;
      console.log(this.indentationCategory);
    }
  };

}
