import {Component, OnInit} from '@angular/core';
import {User} from "../model/User";
import {UserService} from "./services/user.service";
import {StoreUserService} from "./services/store-user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private userService: UserService, private storeUserService: StoreUserService) {
  }

  participe: boolean = false;
  textInFile: string = '';
  userList?: any[];


  ngOnInit() {
    this.retrieveUsers();
    this.storeUserService.storeParticipe.asObservable().subscribe(participe => this.participe = participe)
  }

  createUSer(listUser: Partial<User>[]) {
    listUser.map(user => {
      if (!user) return
      user.id = this.generatorIdentifiant();
      this.userService.createOrUpdate(user).then(() => console.log('user creer'))
    })
  }

  generatorIdentifiant(): string {
    const id = Math.floor(Math.random() * (999999 - 111111) + 111111).toString();
    if (id === '99999' || id === '111111') this.generatorIdentifiant()
    this.userService.getById(id).subscribe(user => user.exists ? this.generatorIdentifiant() : id)
    return id
  }

  retrieveUsers() {
    this.userService.getAll1().subscribe(data => {
      this.userList = data;
      console.table(data)
      this.storeUserService.saveUserList(data)
    });
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
      .map(x => ({name: x[0] ? x[0] : '', username: x[1] ? x[1] : '', tel: x[2] ? x[2] : '', mail: x[3] ? x[3] : ''}));
  }
}

