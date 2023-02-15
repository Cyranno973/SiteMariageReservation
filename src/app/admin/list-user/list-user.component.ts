import {Component, OnInit, ViewChild} from '@angular/core';
import {StoreUserService} from "../../services/store-user.service";
import {User} from "../../../model/User";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit{
  users: User[];
  displayedColumns: string[] = [
    'id', 'name', 'username', 'statusUser', 'menu', 'choice', 'accompaniement', 'tel', 'mail'  ];
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  @ViewChild(MatSort) sort: MatSort;
  empty: boolean;
constructor(private storeUserService: StoreUserService) {
}
ngOnInit() {
  this.storeUserService.observeUserList().subscribe(users => {
    this.users = users;
    console.log(users)
    this.dataSource.data = this.users;
    this.dataSource.sort = this.sort;
  })

}

  onRowClicked(row: string) {
    console.log(row);
  }
  updateFilter(filter: Event):void {
    const inputEl = filter.target as HTMLInputElement;
    const value = inputEl.value;
    const finalFilter = value.trim().toLowerCase();
    this.dataSource.filter = finalFilter;
    console.log(this.dataSource.filteredData);
    console.log(this.dataSource.data.length)
    if(!finalFilter.length) this.empty = true;
  }
}
