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
  indentationCategory: string = '20px';
  // indentationCategory: string = '19ppx';
  indentationValueMenu: string = '0px';
  indentationGuestMenu: string = '0px';
  @ViewChild('selectContainer') selectContainer!: ElementRef;

  constructor(private cdRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    console.log(this.index);
    if(this.index < 0){
      this.indentationCategory = '83px';
      this.indentationValueMenu = `38px`;
    }
    this.dishes = [Menu.Fish, Menu.Meat];
    if (this.form?.get('menu')?.value) this.populateMenus();
  }

  onCategoryChange() {
    console.log('onCategoryChange')
    this.populateMenus();
    const menuChild = this.form.get('selectedCategory')?.value === 'Enfant' ? Menu.Child : '';
    // console.log(this.form.get('selectedCategory')?.value);
    this.form.get('menu')?.setValue(menuChild);
    if (menuChild === '') this.indentationGuestMenu = '35px';
  }

  onMenuChange() {
    console.log(this.form.get('menu')?.value);
    if (this.index < 0){
      if (this.form.get('menu')?.value === Menu.Fish) this.indentationValueMenu = '83px';
      if (this.form.get('menu')?.value === Menu.Meat) this.indentationValueMenu = '86px';
    }
    if (this.form.get('menu')?.value === Menu.Fish) this.indentationGuestMenu = '83px';
    if (this.form.get('menu')?.value === Menu.Meat) this.indentationGuestMenu = '86px';
  }


  private populateMenus = () => {
    const selectedCategory = this.form.get('selectedCategory')?.value;
    console.log(selectedCategory)
    this.dishes = selectedCategory === 'Enfant' ? [Menu.Child] : [Menu.Fish, Menu.Meat];

    selectedCategory === '' ? this.indentationCategory = `35px`: selectedCategory === 'Enfant' ? this.indentationCategory = `85px` : this.indentationCategory = '86px';
    // this.indentationCategory = `89px`; //trop petit a droite
    if (this.form.get('menu')?.value === Menu.Fish) {
      this.indentationValueMenu = `83px`;
      this.indentationGuestMenu = this.indentationValueMenu;
    }
    if (this.form.get('menu')?.value === Menu.Meat) {
      this.indentationValueMenu = `81px`;
      this.indentationGuestMenu = this.indentationValueMenu
    }
    if (this.form.get('menu')?.value === Menu.Child) {
      this.indentationGuestMenu = `62px`;
    }
    if (this.form.get('menu')?.value === null) {
      this.indentationGuestMenu = '11px'; // TODO a supprimer peut etre
    }
    this.cdRef.detectChanges();
  };

}
