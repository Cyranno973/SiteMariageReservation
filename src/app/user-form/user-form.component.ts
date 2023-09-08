import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from "@angular/core";
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
export class UserFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() index: number;
  dishes: string[] = [];
  categories = ['Adulte', 'Enfant'];
  indentationCategory: string = '0px';
  indentationValueMenu: string = '0px';
  indentationGuestMenu: string = '0px';
  @ViewChild('selectContainer') selectContainer!: ElementRef;

  constructor(private cdRef: ChangeDetectorRef) {
  }

  onCategoryChange() {
    this.populateMenus();
    const menuChild = this.form.get('selectedCategory')?.value === 'Enfant' ? Menu.Child : '';
    const menuAdulte = this.form.get('selectedCategory')?.value === 'Adulte';
    console.log(this.form.get('selectedCategory')?.value);
    this.form.get('menu')?.setValue(menuChild);
    if (menuChild === '') this.indentationGuestMenu = '35px';
    // if (menuAdulte === Menu.Meat) this.indentationGuestMenu = '35px';
  }
  onMenuChange(index: number){
    console.log(this.form.get('menu')?.value);
    if (this.form.get('menu')?.value === Menu.Fish) this.indentationGuestMenu = '83px';
    if (this.form.get('menu')?.value === Menu.Fish) this.indentationGuestMenu = '83px';

  }

  ngOnInit(): void {
    console.log(this.form?.get('menu')?.value);
    if (this.form?.get('menu')?.value) this.populateMenus();
  }

  private populateMenus = () => {
    console.log('aiiie');
    const selectedCategory = this.form.get('selectedCategory')?.value;

    this.dishes = selectedCategory === 'Enfant' ? [Menu.Child] : [Menu.Fish, Menu.Meat];
    console.log(this.dishes)
    // const parentWidth = this.selectContainer?.nativeElement.offsetWidth;
    this.indentationCategory = `89px`; //trop petit a droite
    if (this.form.get('menu')?.value === Menu.Fish) {
      this.indentationValueMenu = `83px`;
      this.indentationGuestMenu =this.indentationValueMenu;
    }
    if (this.form.get('menu')?.value === Menu.Meat) {
      this.indentationValueMenu = `86px`;
      this.indentationGuestMenu = this.indentationValueMenu
    }
    if (this.form.get('menu')?.value === Menu.Child) {
      this.indentationGuestMenu = `62px`;
    }
    if (this.form.get('menu')?.value === null) {
      this.indentationGuestMenu = '0px';
    }
    this.cdRef.detectChanges();
  };

}
