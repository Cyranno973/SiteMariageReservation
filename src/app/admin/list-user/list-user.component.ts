import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {StoreUserService} from "../../services/store-user.service";
import {User} from "../../../model/user";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {UserService} from "../../services/user.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit, OnDestroy {
  users: User[];
  private userSubscription: Subscription;
  displayedColumns: string[] = [
    'id', 'name', 'username', 'category', 'statusUser', 'choice', 'menu', 'accompaniement', 'action'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  @ViewChild(MatSort) sort: MatSort;
  empty: boolean;
  @Output() idUser: EventEmitter<User | string> = new EventEmitter<User | string>();

  constructor(private storeUserService: StoreUserService, private userService: UserService) {}

  ngOnInit() {
    this.userSubscription = this.storeUserService.observeUserList().subscribe(users => {
      this.users = users?.filter((user: User) => user.id === "568347");
      console.log(this.users);
      // this.users = users;
      this.dataSource.data = this.users;
      this.dataSource.sort = this.sort;
    })
  }

  onRowClicked(row: User | string) {
    this.idUser.emit(row)
  }

  updateFilter(filter: Event): void {
    const inputEl = filter.target as HTMLInputElement;
    const value = inputEl.value;
    const finalFilter = value.trim().toLowerCase();
    this.dataSource.filter = finalFilter;
    if (!finalFilter.length) this.empty = true;
  }
  toggleOrganization(user: User) {
    user.organisation = !user.organisation;
    console.log(user.organisation);
    this.storeUserService.saveUser(user);
    setTimeout(() =>{
    this.userService.update(user);
    },1000)
  }

  ngOnDestroy() {
    // Désabonnez-vous de l'abonnement ici pour éviter les fuites de mémoire
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
