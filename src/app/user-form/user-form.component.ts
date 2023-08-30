import {AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {Menu} from "../../model/user";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  // encapsulation: ViewEncapsulation.None,
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
export class UserFormComponent implements OnInit, AfterViewInit {
  @Input() form: FormGroup;
  @Input() index: number;
  dishes: string[] = [];
  categories = ['Adulte', 'Enfant'];
  indentationCategory: string = '0';
  indentationValueMenu: string = '0';
  @ViewChild('selectContainer') selectContainer!: ElementRef;
  constructor( private renderer: Renderer2) {
  }
  ngOnInit() {
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
    console.log(selectedCategory);
    this.dishes = selectedCategory === 'Enfant' ? [Menu.Child] : [Menu.Fish, Menu.Meat];
    const parentWidth = this.selectContainer?.nativeElement.offsetWidth;
    console.log(parentWidth);
    console.log(this.form);
    if (selectedCategory === "Adulte"){
      // this.indentationCategory = "3em"
      // this.indentationCategory = "3em"
      this.indentationCategory = `${parentWidth / 2.7}px`;
      if(this.form.get('menu')?.value === ''){

      this.indentationValueMenu = `36px`;
      }
    }
    //
    // // Ajustez l'indentation en fonction du menu sélectionné
    // if (selectedCategory === 'Enfant') {
    //   this.indentationValue = '3em';
    // } else {
    //   this.indentationValue = '3em'; // Aucune indentation pour les autres menus
    // }
  };

}
