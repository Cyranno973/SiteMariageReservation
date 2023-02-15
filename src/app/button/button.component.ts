import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User} from "../../model/User";

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() btnSetting: User;
  @Output() btnEvent = new EventEmitter<string>();

  myBtn(e: string) {
    this.btnEvent.emit(e)
  }
}
