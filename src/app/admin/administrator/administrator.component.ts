import {Component, OnDestroy, OnInit} from '@angular/core';
import {StoreUserService} from "../../services/store-user.service";
import {User} from "../../../model/user";
import {UserService} from "../../services/user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {utils, WorkBook, WorkSheet, writeFile} from 'xlsx';

@Component({
  selector: 'app-admin',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.scss']
})
export class AdministratorComponent implements OnInit, OnDestroy {
  constructor(private fb: FormBuilder, private storeUserService: StoreUserService, private userService: UserService) {

  }

  updateBtn: boolean;
  UserToUpdate: User;
  user: User;
  userList: User[];
  showForm: boolean = false;
  userForm: FormGroup;

  ngOnInit() {
      this.userForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        username: ['', [Validators.required, Validators.minLength(3)]],
        tel: [''],
    })
    this.storeUserService.observeUserList().subscribe(users => {
      this.userList = users;
    })
    this.userService.getAll().subscribe(data => {
      this.userList = data;
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
        console.log(tabUser);
        this.userService.createUSerPartial(tabUser);
      }
      fileReader.readAsText(fileList[0])
    }
  }

  formatText(text: string): Partial<User>[] {
    return text
      .split('\n')
      .filter(ligne => ligne)
      .map(ligne => ligne.toLocaleLowerCase())
      .map(ligne => ligne.split(',').map(colonne => colonne.trim()))
      .map(x => ({id: x[0] ? x[0] : '', name: x[1] ? x[1] : '', username: x[2] ? x[2] : '', tel: x[3] ? x[3] : ''}));
  }


  ngOnDestroy() {
  }

  saveForm(e: string) {
    // if(this.user){
    // }

    // console.log('form ',this.userForm.value.name);
    // console.log('user ',this.user.name);
    this.userService.createUSerPartial([], this.userForm.value);
    this.userForm.reset()
    this.showForm = !this.showForm
    // this.userService.getById()
  }

  updateForm(e: User | string) {
    if (typeof e === "string") {
      this.updateBtn = false;
      this.userService.delete(e);
    } else {
      this.updateBtn = true;
      this.user = e;
      this.userForm.setValue({name: e.name, username: e.username, tel: e.tel || ''})
      this.showForm = true;
    }
  }

  updateSave(user: User) {
    user.id = this.user.id;
    this.userService.update(user);
  }

  toggleForm() {
    this.userForm.reset();
    this.showForm = !this.showForm;
    this.updateBtn = false;

  }

  exportexcel() {
    /* generate worksheet */
    const ws: WorkSheet = utils.json_to_sheet(this.userList);
    /* generate workbook and add the worksheet */
    const wb: WorkBook = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    writeFile(wb, "Liste d'invités.xlsx");
  }
}
