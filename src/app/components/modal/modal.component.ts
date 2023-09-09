import {Component, EventEmitter, Output} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Output() confirmDelete: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private dialogRef: MatDialogRef<ModalComponent>) {
  }

  onConfirm() {
    this.dialogRef.close(true);
  }
}
