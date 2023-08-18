import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {map, Observable} from "rxjs";
import {Entity} from "../../model/media";

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
      map(changes => changes.map(c => ({...c.payload.doc.data(), id: c.payload.doc.id} as T)))
    );
  }

  createOrUpdate(item: T): Promise<void> {
    const cleanedItem = this.cleanObject(item);
    return this.collection.doc(cleanedItem.id).set(cleanedItem);
  }

  updateOrderInFirestore(items: T[]): Promise<void> {
    const batch = this.db.firestore.batch();
    //console.log(items)
    items.forEach((item) => {
      const docRef = this.db.collection(this.dbPath).doc(item.id).ref;
      const cleanedItem = this.cleanObject({order: item.order});
      batch.update(docRef, cleanedItem);
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
    const cleanedItem = this.cleanObject(item);
    return this.collection.doc(cleanedItem.id).update(cleanedItem);
  }

  cleanObject(obj: any) {
    Object.keys(obj).forEach(key =>
      (obj[key] === undefined) && delete obj[key]
    );
    return obj;
  }

}
