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
import {ToastrService} from "ngx-toastr";
import {LoggingService} from "../../services/logging.service";
import {getFormattedDate} from "../../utils/date-utils";

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

  constructor(private statistiquesService: StatistiquesService, private loggingService: LoggingService,
              private fb: FormBuilder, private storeUserService: StoreUserService,
              private userService: UserService, private dialog: MatDialog, private toastr: ToastrService,) {

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
            this.userService.importOrCreateUser(jsonArray);
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
    console.log("saveForm");
    this.userService.importOrCreateUser([], this.userForm.value);
    this.userForm.reset()
    this.showForm = !this.showForm
  }

  updateForm(e: User | string) {
    if (typeof e === "string") {
      this.updateBtn = false;
      const dialogRef = this.dialog.open(ModalComponent, {width: '390px', height: '160px'});

      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
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
    console.log("updateSave");
    user.id = this.user.id;
    this.userService.update(user)
      .then((user) => this.toastr.success(`${user.username} ${user.name}`, 'Modification enregistrer',));
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
      const formattedDate = getFormattedDate(); // Utilisez la fonction importée
      saveAs(blob, `backupListInvite-${formattedDate}.json`);
    } catch (err) {
      console.error('Erreur lors de la conversion en JSON :', err);
    }
  }

  exportLogs(): void {
    this.loggingService.getAllLogs().subscribe(logs => {
      try {
        // Convertir chaque log en une ligne de format simple
        const dataLogsString = logs.map(log => {
          return `[${log.timestamp}] ${log.type.toUpperCase()} - ${log.message}`;
        }).join('\n'); // Joindre chaque ligne avec un saut de ligne

        const blob = new Blob([dataLogsString], {type: 'text/plain;charset=utf-8'});
        const formattedDate = getFormattedDate(); // Utilisez la fonction importée
        saveAs(blob, `backupLogs-${formattedDate}.txt`);
      } catch (err) {
        console.error('Erreur lors de la conversion en format de ligne simple :', err);
      }
    });
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
