import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Media} from "../../model/media";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AngularFireStorage, AngularFireUploadTask} from "@angular/fire/compat/storage";
import {StoreUserService} from "../services/store-user.service";
import {MediaService} from "../services/MediaService";
import {ActivatedRoute} from '@angular/router';
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-user-content-input',
  templateUrl: './user-content-input.component.html',
  styleUrls: ['./user-content-input.component.scss']
})
export class UserContentInputComponent implements OnInit {
  title: string;
  lien: string;
  description: string;
  public file: any = {};
  mediaList: Media[] = [];
  index: number;
  mediaForm: FormGroup;
  updateBtn = false;
  media: Media;
  previewUrl: string | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef;
  admin: boolean = false;
  private showForm: false;
  private collectionPath: string;

  constructor(private fb: FormBuilder,
              private storage: AngularFireStorage,
              private mediaService: MediaService,
              private storeUserService: StoreUserService,
              private route: ActivatedRoute) {
  }


  ngOnInit(): void {

    this.collectionPath = this.route.snapshot.data['collectionPath'];
    console.log(this.collectionPath);
    this.mediaService.setDbPath(this.collectionPath);

    this.storeUserService.observeIsAdmin().subscribe(admin => {
      this.admin = admin;
      this.getActivityData();
      this.mediaForm = this.fb.group({
        title: ['', [Validators.required, Validators.minLength(3)]],
        description: ['', [Validators.required, Validators.minLength(3)]],
        lien: ['', [Validators.required]],
      });
    });
  }

  getActivityData() {
    this.mediaService.getAll().subscribe((medias: Media[]) => {
      this.mediaList = medias.sort((a, b) => a.order - b.order);
      this.index = this.mediaList.length;
    })
  }

  drop(event: CdkDragDrop<Media[]>) {
    moveItemInArray(this.mediaList, event.previousIndex, event.currentIndex);
    this.mediaList.forEach((item, index) => {
      item.order = index;
    });

    this.mediaService.updateOrderInFirestore(this.mediaList).then(() => {
      //console.log('Order updated in Firestore!');
    }).catch((error) => {
      //console.error('Error updating order:', error);
    });
  }

  chooseFile(event: any) {
    if (event?.target?.files && event.target.files.length > 0) {
      this.file = event.target.files[0];
      if (this.updateBtn && this.media) {
        this.media.file = this.file;
      }

      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.previewUrl = event.target.result;
      }
      reader.readAsDataURL(this.file);
    }
  }

  saveMedia() {
    if (!this.file && !this.updateBtn) return;

    const filePath = `images/${this.file?.name ?? (this.media ? this.media.imageUrl.substring(this.media.imageUrl.lastIndexOf('/') + 1) : '')}`;
    const storageRef = this.storage.ref(filePath);

    if (this.file) {
      const uploadTask: AngularFireUploadTask = storageRef.put(this.file);

      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe((downloadUrl) => {
            this.processMediaData(downloadUrl);
          });
        })
      ).subscribe(
        (snapshot) => {
          if (snapshot) {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            //console.log('Upload is ' + progress + '% done');
          }
        },
        (error) => {
          //console.log('Upload error:', error);
        }
      );
    } else {
      this.processMediaData(this.media.imageUrl);
    }
  }

  processMediaData(downloadUrl: string) {
    const mediaData = {
      id: this.updateBtn ? this.media.id : Date.now().toString(),
      title: this.title,
      description: this.description,
      imageUrl: downloadUrl,
      urlExterne: this.lien,
      order: this.index
    };

    if (this.updateBtn) {
      this.mediaService.update(mediaData).then(() => {
        this.updateBtn = false;
        this.mediaForm.reset();
        this.previewUrl = '';
      }).catch((error: any) => {
        //console.error('Error updating:', error);
      });
    } else {
      this.mediaService.createOrUpdate(mediaData).then(() => {
        this.mediaForm.reset();
        this.previewUrl = '';
      }).catch((error: any) => {
        //console.error('Error creating:', error);
      });
    }
  }

  deleteCard(media: Media) {
    const imagePath = media.imageUrl;
    const imageRef = this.storage.refFromURL(imagePath);
    imageRef.delete().subscribe(
      () => {
        this.mediaService.delete(media.id);
      },
      (error) => {
        //console.error('Error deleting image:', error);
      }
    );
  }

  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  updateMedia(media: Media) {
    this.media = media;
    this.file = media.file;
    this.updateBtn = true;
    this.mediaForm.setValue({title: media.title, description: media.description, lien: media.urlExterne});
    this.previewUrl = media.imageUrl;
  }
}
