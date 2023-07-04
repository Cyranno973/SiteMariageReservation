import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {StoreUserService} from "../../services/store-user.service";
import {User} from "../../../model/User";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {
  users: User[];
  displayedColumns: string[] = [
    'id', 'name', 'username', 'tel', 'statusUser', 'choice', 'menu', 'accompaniement', 'action'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  @ViewChild(MatSort) sort: MatSort;
  empty: boolean;
  nbrInvite: number;
  @Output() idUser: EventEmitter<User | string> = new EventEmitter<User | string>();

  constructor(private storeUserService: StoreUserService) {
  }

  ngOnInit() {
    this.storeUserService.observeUserList().subscribe(users => {
      this.users = users;
      console.log(users)
      this.dataSource.data = this.users;
      this.dataSource.sort = this.sort;
       this.users?.length;
    })

  }

  onRowClicked(row: User | string) {
    // console.log(row);
    this.idUser.emit(row)
  }

  updateFilter(filter: Event): void {
    const inputEl = filter.target as HTMLInputElement;
    const value = inputEl.value;
    const finalFilter = value.trim().toLowerCase();
    this.dataSource.filter = finalFilter;
    // console.log(this.dataSource.filteredData);
    // console.log(this.dataSource.data.length)
    if (!finalFilter.length) this.empty = true;
  }
}
