import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {StoreUserService} from "../../services/store-user.service";
import {User} from "../../../model/user";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {UserService} from "../../services/user.service";
import {Subscription} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {UserComponent} from "../user/user.component";
import {ModalComponent} from "../../components/modal/modal.component";

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit, OnDestroy {
  users: User[];
  private userSubscription: Subscription;
  displayedColumns: string[] = [
    'id', 'name', 'username', 'statusUser', 'choice', 'category', 'menu', 'accompaniement', 'action'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  @ViewChild(MatSort) sort: MatSort;
  empty: boolean = true;
  inputValue: string;

  constructor(private storeUserService: StoreUserService, private userService: UserService, private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.userSubscription = this.storeUserService.observeUserList().subscribe(users => {
      this.users = users;
      this.dataSource.data = this.users;
      this.dataSource.sort = this.sort;
    })
  }

  updateUser(originalUser: User) {
    console.log('originalUser ', originalUser);

    const dialogRef = this.dialog.open(UserComponent, {
      width: '360px', height: '390px',
      data: {user: originalUser}
    });

    dialogRef.afterClosed().subscribe(updatedUser => {
      console.log('updatedUser ', updatedUser);
      if (!updatedUser) {
        return
      }
      if (this.areUsersEqual(originalUser as User, updatedUser)) {
        console.log('Aucune modification détectée.');
        return;
      } else {
        console.log('On met à jour l\'utilisateur');
        console.log(originalUser)
        originalUser.name = updatedUser.name;
        originalUser.username = updatedUser.username;
        this.userService.update(originalUser);
        // Code pour mettre à jour l'utilisateur ici...
      }
    });
  }

// Compare deux objets User
  areUsersEqual(user1: User, user2: User): boolean {
    return user1.name === user2.name && user1.username === user2.username;
    // Ajoutez d'autres champs si nécessaire...
  }

  deleteUser(id: string) {
    const dialogRef = this.dialog.open(ModalComponent, {width: '390px', height: '160px'})
    dialogRef.afterClosed().subscribe((confirmation: boolean) => {
      if (confirmation) this.userService.delete(id);
    });
  }

  updateFilter(filter: Event): void {
    const inputEl = filter.target as HTMLInputElement;
    this.inputValue = inputEl.value;
    const finalFilter = this.inputValue.trim().toLowerCase();
    this.dataSource.filter = finalFilter;
    if (!finalFilter.length) this.empty = true;
  }

  toggleOrganization(user: User) {
    user.organisation = !user.organisation;
    console.log(user.organisation);
    this.storeUserService.saveUser(user);
    setTimeout(() => {
      this.userService.update(user);
    }, 1000)
  }

  ngOnDestroy() {
    // Désabonnez-vous de l'abonnement ici pour éviter les fuites de mémoire
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
