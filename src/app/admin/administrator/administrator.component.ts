import {Component, OnDestroy, OnInit} from '@angular/core';
import {StoreUserService} from "../../services/store-user.service";
import {User} from "../../../model/user";
import {UserService} from "../../services/user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {utils, WorkBook, WorkSheet, writeFile} from 'xlsx';
import {StatistiquesService} from "../../services/statistiques.service";
import {AttendanceStatistics} from "../../../model/AttendanceStatistics";
import {Observable, Subscription, take} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {ModalComponent} from "../../components/modal/modal.component";
import {ToastrService} from "ngx-toastr";
import {LoggingService} from "../../services/logging.service";
import {getFormattedDate} from "../../utils/date-utils";
import {UserComponent} from "../user/user.component";
import {saveAs} from 'file-saver-es';


@Component({
  selector: 'app-admin',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.scss'],
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

  constructor(
    private statistiquesService: StatistiquesService,
    private loggingService: LoggingService,
    private fb: FormBuilder,
    private storeUserService: StoreUserService,
    private userService: UserService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
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
      this.storeUserService.saveUserList(data);
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
      const dialogRef = this.dialog.open(ModalComponent, {width: '350px', height: '350px'});
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
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

  addUser() {
    const dialogRef = this.dialog.open(UserComponent, {
      width: '350px', height: '350px'
    });

    dialogRef.afterClosed().subscribe((user: Partial<User>) => {
      console.log('Dialog closed', user);
      if (!user?.id) this.userService.importOrCreateUser([], user);
      this.userForm.reset();
    });
  }

  exportExcel() {
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
    this.loggingService.getAllLogs().pipe(take(1)).subscribe(logs => {
      try {
        const sortedLogs = logs.sort((a, b) => b.timestamp - a.timestamp);
        // Convertir chaque log en une ligne de format simple
        const dataLogsString = sortedLogs.map(log => {
          return `[${getFormattedDate(log.timestamp, 'log')}] ${log.type.toUpperCase()} - ${log.message}`;
        }).join('\n'); // Joindre chaque ligne avec un saut de ligne

        const blob = new Blob([dataLogsString], {type: 'text/plain;charset=utf-8'});
        saveAs(blob, `backupLogs-${getFormattedDate()}.txt`);
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
