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
export class AppComponent implements OnInit {
  constructor(private afs: AngularFirestore, private userService: UserService) {
  }

  myCollection: Subscription | undefined;
  // tutorial: AngularFirestoreDocument<any>;
  title = 'AndreStella';
  numberOk: boolean = false;
  idUi: number[] = [];
  textInFile: string = '';
  tab: string[] = [];
  userList?: any[];


  ngOnInit() {
    this.retrieveUsers();
  }

  createUSer(listUser: Partial<User>[]){
    listUser.map(user => {
      if (!user) return
      user.id = this.generatorIdentifiant();
      this.userService.create(user).then(() => console.log('user creer'))
    })
  }
  retrieveUsers() {
    this.userService.getAll().snapshotChanges().pipe(
      map(changes => changes.map(c => ({id: c.payload.doc.id, ...c.payload.doc.data()}))))
        .subscribe(data => {
        this.userList = data
        console.log('list in firebase ',this.userList)
    });
  }

  generatorIdentifiant(): number {
    const id = Math.floor(Math.random() * (999999 - 111111) + 111111);
    if (id !== 99999 && id !== 111111 && !this.idUi.includes(id)) this.idUi.push(id)
    else this.generatorIdentifiant();
    return id
  }

  readFile($event: Event) {
    const inputEl = $event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = inputEl.files;
    if (fileList?.length) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const text = fileReader.result as string;
        const tabUser = this.formatText(text);
        this.createUSer(tabUser);
      }
      fileReader.readAsText(fileList[0])
    }
  }
  formatText(text: string): Partial<User>[] {
      return text
      .split('\n')
      .filter(ligne => ligne)
      .map(ligne => ligne.toLowerCase())
      .map(ligne => ligne.split(',').map(colonne => colonne.trim()))
      .map(x => ({name: x[0]? x[0]: '', username: x[1]? x[1]: '', tel: x[2]? x[2]: '' , mail: x[3]? x[3]: ''}));


  }

}

