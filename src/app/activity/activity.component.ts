import { Component } from '@angular/core';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent {
  image: string;
  description: string;

  onSave() {
    // Logic to handle saving the image and description
  }
}
