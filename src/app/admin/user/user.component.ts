import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../model/user";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  userForm: FormGroup;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<UserComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  user: User;

  ngOnInit() {
    this.userForm = this.fb.group({
      name: [this.data?.user.name || '', [Validators.required, Validators.minLength(3)]],
      username: [this.data?.user.username || '', [Validators.required, Validators.minLength(3)]],
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.userForm.value);
  }
}
