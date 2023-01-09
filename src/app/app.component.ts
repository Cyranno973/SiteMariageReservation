import {Component, OnInit} from '@angular/core';
import {User} from "../model/User";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {map, Subscription} from "rxjs";
import {UserService} from "./services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(private afs: AngularFirestore, private userService: UserService) {
  }

 myCollection: Subscription | undefined;
  // tutorial: AngularFirestoreDocument<any>;
  title = 'AndreStella';
  idUi: number[] = [];
  textInFile: string = '';
  tab: string[] = [];
  userList?: any[];


  ngOnInit() {
    this.retrieveUsers()
   // this.tutorial = this.afs.doc('tutorial')
   //  const collectionUsers = this.afs.collection('users');
   //  const user = {title: 'blalvla', url:'http'}
    // collectionUsers.add({...user})

    // this.myCollection = this.afs.collection('lulu').valueChanges().subscribe(v => console.log(v));
    // this.afs.collection('users').doc('Nou5DkL8ofVanDCNpCGB').set({toto: 'titi'})
    // this.afs.collection('users').doc('tutorial').set({ae: 'aaa'})
  }
retrieveUsers(){
    this.userService.getAll().snapshotChanges().pipe(
      map(changes =>
      changes.map(c => ({id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
  ).subscribe(data => {
      this.userList = data
      console.log(this.userList)
    });
}
  generatorIdentifiant(): void{
    const id = Math.floor(Math.random() * (999999 - 111111) + 111111);
    if(id !== 99999 && id !== 111111 && !this.idUi.includes(id)) this.idUi.push(id);
    else this.generatorIdentifiant();
  }

  readFile($event: Event) {
    const inputEl = $event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = inputEl.files;
    if (fileList?.length) {
      console.log(fileList)
      const fileReader = new FileReader();
      fileReader.onload = () => {
        let text = fileReader.result as string;
        const tab = text.split('\n').map(ligne => ligne.toLowerCase().split(',').map(colonne => colonne.trim()));
        console.log(tab)
        const tabUSer: Partial<User>[] = [];
        tab.map(info => {
          console.log(info)
          const user: Partial<User> = {name:info[0], username: info[1], tel:info[2], mail:info[3]}
          tabUSer.push(user);
        })
        console.log(tabUSer)
        const re = tabUSer.map(user =>{
          const userString = JSON.stringify(user, (key, value) => value === undefined ? null : value);
          return JSON.parse(userString);
        })
        console.log(re)
      }
      fileReader.readAsText(fileList[0])
    }
  }
}

