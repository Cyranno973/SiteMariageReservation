import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/compat/storage';
import {finalize} from 'rxjs/operators';
import {AssetsDataService} from "../services/assets-data.service";
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {Media} from "../../model/media";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})

export class ActivityComponent implements OnInit{
  title: string;
  lien: string;
  description: string;
  public file: any = {};
  activityList: Media[] = [];
  index: number;
  mediaForm: FormGroup;
  updateBtn = false;
  media: Media;
  @ViewChild('fileInput') fileInput!: ElementRef;
  private showForm: false;
  constructor(private fb: FormBuilder, private storage: AngularFireStorage, private assetsData: AssetsDataService) {
  }
  ngOnInit(): void {
    this.getActivityData();
    this.mediaForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      lien: [''],
    });
  }
  getActivityData() {
    this.assetsData.getAll().subscribe((activityList:Media[]) => {
      this.activityList = activityList.sort( (a,b) => a.order - b.order );
      this.index = this.activityList.length;
    })
  }
  drop(event: CdkDragDrop<Media[]>) {
    moveItemInArray(this.activityList, event.previousIndex, event.currentIndex);
    this.assetsData.updateOrderInFirestore(this.activityList).then(() => {
      console.log('Order updated in Firestore!');
    }).catch((error) => {
      console.error('Error updating order:', error);
    });
  }

  chooseFile(event: any) {
    console.log(event)
    if (event?.target?.files && event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }

  saveMedia() {
    if(this.updateBtn) return this.assetsData.createOrUpdate(this.media);
    console.log('Description:', this.description);
    console.log('lien:', this.lien);
    console.log('file :', this.file.name);

    const filePath = `images/${this.file.name}`;
    if (!this.file.name) return;
    const storageRef = this.storage.ref(filePath);
    const uploadTask: AngularFireUploadTask = storageRef.put(this.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe((downloadUrl) => {
          // console.log('File available at', downloadUrl);
          this.assetsData.createOrUpdate({id: Date.now().toString(), title:this.title,
            description: this.description, imageUrl: downloadUrl, urlExterne: this.lien, order: this.index})
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

  deleteCard(media: Media) {
    console.log(media);
    const imagePath = media.imageUrl;
    const imageRef = this.storage.refFromURL(imagePath);
    imageRef.delete().subscribe(
      () => {
        console.log('Image deleted successfully');
        this.assetsData.delete(media.id)
      },
      (error) => {
        console.error('Error deleting image:', error);
      }
    );
  }

  openFileInput() {
    this.fileInput.nativeElement.click();
  }
  updateMedia(media: Media){
    console.log(media)
    this.media = media
    this.updateBtn = true;
      this.mediaForm.setValue({title: media.title, description: media.description, lien: media.urlExterne})
      // this.showForm = true;
  // this.assetsData.update({...media})
  }
}
