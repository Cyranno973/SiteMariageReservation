import {Component, OnDestroy, OnInit} from '@angular/core';
import {StoreUserService} from "../../services/store-user.service";
import {User} from "../../../model/user";
import {UserService} from "../../services/user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {utils, WorkBook, WorkSheet, writeFile} from 'xlsx';
import {StatistiquesService} from "../../services/statistiques.service";
import {AttendanceStatistics} from "../../../model/AttendanceStatistics";
import {saveAs} from 'file-saver';
import {Observable, Subscription} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {ModalComponent} from "../../components/modal/modal.component";

@Component({
  selector: 'app-admin',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.scss']
})
export class AdministratorComponent implements OnInit, OnDestroy {
  attendanceStatistics$: Observable<AttendanceStatistics>;

  updateBtn: boolean;
  user: User;
  userList: User[];
  showForm: boolean = false;
  userForm: FormGroup;
  private userSubscription: Subscription;
  private userStoreSubscription: Subscription;
  private storeUserSubscription: Subscription;

  constructor(private statistiquesService: StatistiquesService,
              private fb: FormBuilder, private storeUserService: StoreUserService,
              private userService: UserService, private dialog: MatDialog) {

  }

  ngOnInit() {
    this.attendanceStatistics$ = this.statistiquesService.getAttendanceStatistics();
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      tel: [''],
    });
    this.userStoreSubscription = this.storeUserService.observeUserList().subscribe(users => this.userList = users);
    this.userSubscription = this.userService.getAll().subscribe(data => {
      this.userList = data;
      // console.log(data[80]);
      // console.log(data);
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
        try {
          const jsonArray = JSON.parse(text);
          if (Array.isArray(jsonArray)) {
            this.userService.createUSerPartial(jsonArray);
          } else {
            console.error('JSON data is not an array.');
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      fileReader.readAsText(fileList[0]);
    }
  }


  saveForm() {
    this.userService.createUSerPartial([], this.userForm.value);
    this.userForm.reset()
    this.showForm = !this.showForm
  }

  updateForm(e: User | string) {
    if (typeof e === "string") {
      this.updateBtn = false;
      const dialogRef = this.dialog.open(ModalComponent, {width: '390px', height: '160px'});

      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          console.log(result);
          // console.log('suppression effectué')
          this.userService.delete(e);
        }
      });
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

  exportUser() {
    try {
      const dataUserJson = JSON.stringify(this.userList);
      const blob = new Blob([dataUserJson], {type: 'text/plain;charset=utf-8'});
      const currentDate = new Date();
      const day = String(currentDate.getDate()).padStart(2, '0');
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const year = String(currentDate.getFullYear());
      const hour = String(currentDate.getHours()).padStart(2, '0');
      const minutes = String(currentDate.getMinutes()).padStart(2, '0');
      const seconds = String(currentDate.getSeconds()).padStart(2, '0');
      const formattedDate = `${year}${month}${day}-${hour}${minutes}${seconds}`;

      saveAs(blob, `backupListInvite-${formattedDate}.json`);
    } catch (err) {
      console.error('Erreur lors de la conversion en JSON :', err)
    }
  }

  ngOnDestroy() {
    // Désabonnez tous les observables pour éviter les fuites mémoire
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }

    if (this.userStoreSubscription) {
      this.userStoreSubscription.unsubscribe();
    }
    if (this.storeUserSubscription) {
      this.storeUserSubscription.unsubscribe();
    }
  }
}
