import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {map, Observable} from "rxjs";
import { Media } from "../../model/media"
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

  getById(id: string): Observable<any> {
    return this.mediaRef.doc(id).get();
  }
  createOrUpdate(media: Media, creation: boolean = false): any {
    return this.mediaRef.doc(media.id).set(media).then(asset => console.log('asset creer'));    const userClean = this.removeEmptyProperties(media);
    // const userClean = this.removeEmptyProperties(media);
    // return this.mediaRef.doc(userClean.id).set(userClean).then(asset => console.log('asset creer'));
  }
  removeEmptyProperties(obj: any) {
    Object.keys(obj).forEach(key => {
      if (obj[key] === "" || obj[key] === null || obj[key] === '') {
        delete obj[key];
        return obj
      }
    });
    return obj
  }
}
