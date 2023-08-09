import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {map, Observable} from "rxjs";
import {Entity} from "../../model/media";


@Injectable({
  providedIn: 'root'
})
export class AbstractCrudFichier<T extends Entity> {
  collection: AngularFirestoreCollection<T>;
  db: AngularFirestore;
  dbPath: string;

  constructor(db: AngularFirestore, dbPath: string) {
    this.collection = db.collection<T>(dbPath);
    this.db = db;
    this.dbPath = dbPath;
  }

  getAll(): Observable<T[]> {
    return this.collection.snapshotChanges().pipe(
      map(changes => changes.map(c => ({ ...c.payload.doc.data(), id: c.payload.doc.id } as T)))
    );
  }

  createOrUpdate(item: T): Promise<void> {
    return this.collection.doc(item.id).set(item);
  }

  updateOrderInFirestore(items: T[]): Promise<void> {
    const batch = this.db.firestore.batch();

    items.forEach((item) => {
      const docRef = this.db.collection(this.dbPath).doc(item.id).ref;
      batch.update(docRef, { order: item.order });
    });

    return batch.commit();
  }

  delete(id: string): Promise<void> {
    return this.collection.doc(id).delete();
  }

  update(item: Partial<T>): Promise<void> {
    if (!item.id) {
      throw new Error("ID is required to update an item.");
    }
    return this.collection.doc(item.id).update(item);
  }
}
