import {Component, HostListener, OnInit} from '@angular/core';
import {Choice, Status, User} from "../model/User";
import {UserService} from "./services/user.service";
import {StoreUserService} from "./services/store-user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private userService: UserService, private storeUserService: StoreUserService, private router: Router) {
  }

@HostListener('window:keyup',['$event']) onKeyUp(e: KeyboardEvent ){
  this.pressedKeys.push(e.code)
  // console.log(this.pressedKeys)
  if(this.pressedKeys.length === 8){
    if(this.pressedKeys.join('') === this.secretCode){
      this.admin = !this.admin;
      this.storeUserService.saveIsAdmin(this.admin);
      if(this.admin) console.log('mode admin')
      else {
        console.log('mode user')
       this.router.navigate(['/']);
      }

    }
    this.pressedKeys.splice(0, 1);
  }
}
  pressedKeys: string[] = [];
  secretCode: string = "ArrowLeftArrowLeftArrowRightArrowRightArrowUpArrowUpArrowDownArrowDown"
  admin: boolean = false;
  textInFile: string = '';
  userList?: any[];
  user: User;

  ngOnInit() {
    this.retrieveUsers();
    this.storeUserService.observeUser().subscribe(user => this.user = user);
  }

  createUSer(listUser: Partial<User>[]) {
    listUser.map(user => {
      if (!user) return
      user.id = this.generatorIdentifiant();
      user.statusUser = Status.First;
      user.choice = Choice.All;
      user.accompaniement = [];
      return this.userService.createOrUpdate(user, true);
    })
    return false
  }

  generatorIdentifiant(): string {
    const id = Math.floor(Math.random() * (999999 - 111111) + 111111).toString();
    if (id === '99999' || id === '111111') this.generatorIdentifiant()
    this.userService.getById(id).subscribe(user => user.exists ? this.generatorIdentifiant() : id)
    return id
  }

  retrieveUsers() {
    this.userService.getAll().subscribe(data => {
      this.userList = data;
      // console.log(this.userList)
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
      .map(x => ({name: x[0] ? x[0] : '', username: x[1] ? x[1] : '', tel: x[2] ? x[2] : ''}));
  }
}

