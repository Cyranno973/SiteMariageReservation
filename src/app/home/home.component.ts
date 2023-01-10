import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {map} from "rxjs";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  constructor(private userService: UserService) {
  }
  userList?: any[];
  form: FormGroup = new FormGroup({
    numero: new FormControl('', [Validators.required])
  });

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
  submit(){
    const isNumeroPresent = this.userList?.map(x => x.id).includes(Number(this.form.value.numero));
    console.log(isNumeroPresent)
  }
}
