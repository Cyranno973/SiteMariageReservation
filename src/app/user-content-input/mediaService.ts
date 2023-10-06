import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {map, Observable} from "rxjs";
import {Media} from "../../model/media";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private collection: AngularFirestoreCollection<Media>;
  private db: AngularFirestore;
  private dbPath: string;

  constructor(db: AngularFirestore) {
    this.db = db;
  }

  setDbPath(dbPath: string) {
    this.dbPath = dbPath;
    this.collection = this.db.collection<Media>(this.dbPath);
  }
  getAll(): Observable<Media[]> {
    return this.collection.snapshotChanges().pipe(
      map(changes => changes.map(c => ({...c.payload.doc.data(), id: c.payload.doc.id} as Media)))
    );
  }

  createOrUpdate(media: Media): Promise<void> {
    const cleanedMedia = this.cleanObject(media);
    return this.collection.doc(cleanedMedia.id).set(cleanedMedia);
  }

  updateOrderInFirestore(mediaList: Media[]): Promise<void> {
    const batch = this.db.firestore.batch();
    mediaList.forEach((media) => {
      const docRef = this.db.collection(this.dbPath).doc(media.id).ref;
      const cleanedMedia = this.cleanObject({order: media.order});
      batch.update(docRef, cleanedMedia);
    });
    return batch.commit();
  }

  delete(id: string): Promise<void> {
    return this.collection.doc(id).delete();
  }

  update(media: Partial<Media>): Promise<void> {
    if (!media.id) {
      throw new Error("ID is required to update an item.");
    }
    const cleanedMedia = this.cleanObject(media);
    return this.collection.doc(cleanedMedia.id).update(cleanedMedia);
  }

  private cleanObject(obj: any) {
    Object.keys(obj).forEach(key => (obj[key] === undefined) && delete obj[key]);
    return obj;
  }
}
