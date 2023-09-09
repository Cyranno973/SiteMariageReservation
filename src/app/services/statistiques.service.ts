import {Injectable} from '@angular/core';
import {Personne, Status, User} from "../../model/user";
import {UserService} from "./user.service";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {AttendanceStatistics} from "../../model/AttendanceStatistics";

@Injectable({
  providedIn: 'root'
})
export class StatistiquesService {
  constructor(private userService: UserService) {}

  // numberIdentification = () =>
  getAttendanceStatistics(): Observable<AttendanceStatistics> {
    return this.userService.getAll().pipe(
      map(users => {
        const statistics: AttendanceStatistics = {
          present: 0,
          absent: 0,
          notChosen: 0,
          poissonCount: 0,
          viandeCount: 0,
          menuIncomplet:0,
          enfantCount: 0,
          mainGuestCount: 0,
          accompanyingGuestCount: 0,
          adultCount: 0,
          totalPeople: 0
        };

        users.forEach((user: User) => {
          if (user.choice === 'p') {
            statistics.present++;
          } else if (user.choice === 'a') {
            statistics.absent++;
          } else if (user.choice === 'all') {
            statistics.notChosen++;
          }
          if (user.menu === 'Poisson') {
            statistics.poissonCount++;
          } else if (user.menu === 'Viande') {
            statistics.viandeCount++;
          } else if (user.menu === 'Menu enfant') {
            statistics.enfantCount++;
          }

          if (user.selectedCategory === 'Enfant') {
            statistics.enfantCount++;
          } else if (user.selectedCategory === 'Adulte' && user.choice === 'p') {
            statistics.adultCount++;
          }

          if (user.accompaniement) {
            user.accompaniement.forEach((acc: Personne) => {
              if (acc.menu === 'Poisson') {
                statistics.poissonCount++;
              } else if (acc.menu === 'Viande') {
                statistics.viandeCount++;
              } else if (acc.menu === 'Menu enfant') {
                statistics.enfantCount++;
              }
              if (acc.selectedCategory === 'Adulte') {
                statistics.adultCount++;
              }
              statistics.accompanyingGuestCount++;
            });
          }

          if (user.id) {
            statistics.mainGuestCount++;
          }
        });

        // console.log(statistics.accompanyingGuestCount)
        statistics.totalPeople = statistics.present + statistics.accompanyingGuestCount;
        statistics.menuIncomplet = users.filter((user: User) => user.statusUser === Status.Incomplete).length;
        return statistics;
      })
    );
  }
}
