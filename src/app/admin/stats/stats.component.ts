import {Component, Input} from '@angular/core';
import {AttendanceStatistics} from "../../../model/AttendanceStatistics";
import {Observable} from "rxjs";

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent {
  @Input() statistics$: Observable<AttendanceStatistics>;
}
