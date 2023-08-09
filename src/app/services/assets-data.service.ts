import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {map, Observable} from "rxjs";
import {Media} from "../../model/media"

@Injectable({
  providedIn: 'root'
})
export class AssetsDataService {

  private dbPath = '/media';
  private mediaRef: AngularFirestoreCollection<Media>;

  constructor(private db: AngularFirestore) {
    this.mediaRef = db.collection(this.dbPath);
  }

  getAll(): Observable<any> {
    return this.mediaRef.snapshotChanges().pipe(
      map(changes => changes.map(c => ({...c.payload.doc.data(), id: c.payload.doc.id}))));
  }

  createOrUpdate(media: Media, creation: boolean = false): any {
    return this.mediaRef.doc(media.id).set(media).then(asset => console.log('asset creer'));
  }

  updateOrderInFirestore(activityList: Media[]): Promise<void> {
    const batch = this.db.firestore.batch();

    activityList.forEach((item, index) => {
      const docRef = this.db.collection(this.dbPath).doc(item.id).ref;
      batch.update(docRef, {order: index});
    });

    return batch.commit().then(() => {
      console.log('Order updated in Firestore!');
    }).catch((error) => {
      console.error('Error updating order:', error);
    });
  }

  delete(id: string): Promise<void> {
    return this.mediaRef.doc(id).delete()
  }

  update(media: Partial<Media>): any {
    return this.mediaRef.doc(media.id).update(media).then(media => console.log('media modifier'))
  }
}
