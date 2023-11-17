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

  exportExcel1() {
    /* generate worksheet */
    const ws: WorkSheet = utils.json_to_sheet(this.userList);
    console.log(this.userList);
    /* generate workbook and add the worksheet */
    const wb: WorkBook = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    writeFile(wb, "Liste d'invités.xlsx");
  }
  exportExcel() {
    // Fonction pour aplatir les données, exclure certaines propriétés et réorganiser les colonnes
    const flattenData = (userList: any[]) => {
      return userList.map((user: any) => {
        // Déconstruction pour exclure certaines propriétés et réorganiser
        const { id, name, username, choice, menu, allergie, selectedCategory, statusUser, accompaniement, fcmTokens, isModifying, organisation, ...rest } = user;

        if (user.accompaniement && user.accompaniement.length > 0) {
          // Pour les utilisateurs avec accompagnateurs
          return user.accompaniement.map((accomp: any) => {
            return {
              id,
              name,
              username,
              choice,
              menu,
              allergie, // Allergie juste après menu
              selectedCategory,
              statusUser,
              accName: accomp.name,
              accUsername: accomp.username, // Ajout de accUsername
              accMenu: accomp.menu,
              accAllergie: accomp.allergie,
              accCategory: accomp.selectedCategory,
              ...rest // Reste des propriétés
            };
          });
        } else {
          // Pour les utilisateurs sans accompagnateurs
          return [{
            id,
            name,
            username,
            choice,
            menu,
            allergie, // Allergie juste après menu
            selectedCategory,
            statusUser,
            accName: '',
            accUsername: '', // Ajout de accUsername
            accMenu: '',
            accAllergie: '',
            accCategory: '',
            ...rest
          }];
        }
      }).flat();
    };

    // Aplatir la liste d'utilisateurs
    const flattenedData = flattenData(this.userList);

    // Convertir en feuille de travail Excel
    const ws: WorkSheet = utils.json_to_sheet(flattenedData);
    const wb: WorkBook = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Sheet1');
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
