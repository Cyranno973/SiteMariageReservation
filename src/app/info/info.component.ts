import {Component, ElementRef, ViewChild} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Media} from "../../model/media";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AngularFireStorage, AngularFireUploadTask} from "@angular/fire/compat/storage";
import {StoreUserService} from "../services/store-user.service";
import {finalize} from "rxjs/operators";
import {MediaInfoService} from "../services/media-info-service";

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent {
  title: string;
  lien: string;
  description: string;
  public file: any = {};
  activityList: Media[] = [];
  index: number;
  mediaForm: FormGroup;
  updateBtn = false;
  media: Media;
  previewUrl: string | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef;
  admin: boolean = false;
  private showForm: false;

  constructor(private fb: FormBuilder,
              private storage: AngularFireStorage,
              private mediaInfoService: MediaInfoService,
              private storeUserService: StoreUserService) {
  }

  ngOnInit(): void {
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
    this.mediaInfoService.getAll().subscribe((activityList: Media[]) => {
      this.activityList = activityList.sort((a, b) => a.order - b.order);
      this.index = this.activityList.length;
    })
  }

  drop(event: CdkDragDrop<Media[]>) {
    moveItemInArray(this.activityList, event.previousIndex, event.currentIndex);
    //console.log(event.previousIndex, event.currentIndex);
    //console.table(this.activityList)
    this.activityList.forEach((item, index) => {
      item.order = index;
    });
    //console.table(this.activityList)

    this.mediaInfoService.updateOrderInFirestore(this.activityList).then(() => {
      //console.log('Order updated in Firestore!');
    }).catch((error) => {
      //console.error('Error updating order:', error);
    });
  }

  chooseFile(event: any) {
    //console.log(event)
    if (event?.target?.files && event.target.files.length > 0) {
      this.file = event.target.files[0];
      if (this.updateBtn && this.media) {
        this.media.file = this.file;
      }

      // Ajoutez ce bloc pour l'aperçu de l'image
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.previewUrl = event.target.result;
      }
      reader.readAsDataURL(this.file);
    }
  }


  saveMedia() {
    //console.log('Description:', this.description);
    //console.log('lien:', this.lien);
    //console.log('file :', this.file?.name);

    if (!this.file && !this.updateBtn) return;

    // const filePath = `images/${this.file?.name ?? this.media.imageUrl.substring(this.media.imageUrl.lastIndexOf('/') + 1)}`;
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
      this.mediaInfoService.update(mediaData).then(() => {
        //console.log('Updated in Firestore!');
        this.updateBtn = false;  // réinitialiser le bouton de mise à jour
        this.mediaForm.reset();   // réinitialiser le formulaire
        this.previewUrl = '';
      }).catch((error: any) => {
        //console.error('Error updating:', error);
      });
    } else {
      this.mediaInfoService.createOrUpdate(mediaData).then(() => {
        //console.log('Created in Firestore!');
        this.mediaForm.reset();  // réinitialiser le formulaire
        this.previewUrl = '';
      }).catch((error: any) => {
        //console.error('Error creating:', error);
      });
    }
  }


  deleteCard(media: Media) {
    //console.log(media);
    const imagePath = media.imageUrl;
    const imageRef = this.storage.refFromURL(imagePath);
    imageRef.delete().subscribe(
      () => {
        //console.log('Image deleted successfully');
        this.mediaInfoService.delete(media.id)
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
    //console.log(this.media)
    //console.log(media)
    this.media = media;
    this.file = media.file;
    this.updateBtn = true;
    this.mediaForm.setValue({title: media.title, description: media.description, lien: media.urlExterne})
    this.previewUrl = media.imageUrl;
    // this.showForm = true;
    // this.mediaInfoService.update({...media})
  }
}
