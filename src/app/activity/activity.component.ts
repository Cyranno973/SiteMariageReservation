import {Component, OnInit} from '@angular/core';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/compat/storage';
import {finalize} from 'rxjs/operators';
import {AssetsDataService} from "../services/assets-data.service";
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {Media} from "../../model/media";


@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})

export class ActivityComponent implements OnInit{
  description: string;
  url: string;
  public file: any = {};
  activityList: Media[] = [];
  index: number;
  constructor(private storage: AngularFireStorage, private assetsData: AssetsDataService) {
  }
  ngOnInit(): void {
    this.getActivityData();
  }
  getActivityData() {
    this.assetsData.getAll().subscribe((activityList:Media[]) => {
      this.activityList = activityList.sort( (a,b) => a.order - b.order );
      this.index = this.activityList.length;
    })
  }
  drop(event: CdkDragDrop<Media[]>) {
    moveItemInArray(this.activityList, event.previousIndex, event.currentIndex);
    console.log('Activity List:', this.activityList[0]);
    this.assetsData.updateOrderInFirestore(this.activityList).then(() => {
      console.log('Order updated in Firestore!');
    }).catch((error) => {
      console.error('Error updating order:', error);
    });
  }

  chooseFile(event: any) {
    console.log(event, 'aaa')
    if (event?.target?.files && event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }

  addData() {
    console.log('Description:', this.description);
    console.log('Url:', this.url);
    console.log('file :', this.file.name);

    const filePath = `images/${this.file.name}`;
    if (!this.file.name) return;
    const storageRef = this.storage.ref(filePath);
    const uploadTask: AngularFireUploadTask = storageRef.put(this.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe((downloadUrl) => {
          // console.log('File available at', downloadUrl);
          this.assetsData.createOrUpdate({id: Date.now().toString(),
            description: this.description, imageUrl: downloadUrl, urlExterne: this.url, order: this.index})
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
