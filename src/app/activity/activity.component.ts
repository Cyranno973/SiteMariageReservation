import { Component } from '@angular/core';
import {  AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent {
  description: string;
  public file: any = {};

  constructor(private storage: AngularFireStorage) {}

  chooseFile(event: any) {
    console.log(event,'aaa')
    if (event?.target?.files && event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }

  addData() {
    console.log('Description:', this.description);
    console.log('file :', this.file.name);

    const filePath = `images/${this.file.name}`;
    if(!this.file.name) return;
    const storageRef = this.storage.ref(filePath);
    const uploadTask: AngularFireUploadTask = storageRef.put(this.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe((downloadUrl) => {
          console.log('File available at', downloadUrl);
        });
      })
    ).subscribe(
      (snapshot) => {
        if (snapshot) {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        }
      },
      (error) => {
        console.log('Upload error:', error);
      }
    );
  }
}
