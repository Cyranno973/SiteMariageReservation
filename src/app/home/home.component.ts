import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {map} from "rxjs";
import {UserService} from "../services/user.service";
import {MatDialog} from "@angular/material/dialog";
import {UserProfileComponent} from "../user-profile/user-profile.component";
import {trigger, keyframes, animate, transition, style} from "@angular/animations";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],

  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({  opacity: 0 }),
            animate('5s ease-out',
              style({ opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ height: 300, opacity: 1 }),
            animate('1s ease-in',
              style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})


export class HomeComponent implements OnInit{
  constructor(private userService: UserService, private dialogUser: MatDialog, private fb: FormBuilder) {
  }
  userList?: any[];
  inputBillet: string = '';
  participation: boolean = false;
  errorFormulaire: boolean = false;
  // form: FormGroup = new FormGroup({
  //   numero: new FormControl('', [Validators.required])
  // });
  form: FormGroup = this.fb.group({
    numero: ['']
  })
  ngOnInit() {
   this.retrieveUsers();
  }
  retrieveUsers() {
    this.userService.getAll().snapshotChanges().pipe(
      map(changes => changes.map(c => ({id: c.payload.doc.id, ...c.payload.doc.data()}))))
      .subscribe(data => {
        this.userList = data
        console.log('list in firebase ',this.userList)
      },
          error => console.log('erreur :', error),
        () => console.log('tache fini')
      );
  }

  submit($event: Event){
    const inputElt = $event.target as HTMLInputElement;
    this.inputBillet = inputElt.value;
    const reg = new RegExp('^[0-9]*$');
    console.log(reg.test(this.inputBillet))
    if (reg.test(this.inputBillet) && this.inputBillet.length === 6){
      console.log('on test')
      const isNumeroPresent = this.userList?.map(x => x.id).includes(Number(this.form.value.numero));
      console.log(isNumeroPresent)
      if(isNumeroPresent){
        this.form.disable()
        this.participation = true;
      }else{
        console.log('yoo')
        this.errorFormulaire =true;
      }
    }
  }

  showBtn() {
    this.participation = !this.participation;
  }
}
