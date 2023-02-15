import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {User} from "../../model/User";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private dbPath = '/users';
  private usersRef: AngularFirestoreCollection<User>;

  constructor(private db: AngularFirestore) {
    this.usersRef = db.collection(this.dbPath);
  }

  getAll(): Observable<any> {
    return this.usersRef.snapshotChanges().pipe(
      map(changes => changes.map(c => ({...c.payload.doc.data(), id: c.payload.doc.id}))));
  }

  getById(id: string): Observable<any> {
    return this.usersRef.doc(id).get();
  }


  /**avec firebase si on veut creer une collection avec un od personalisé il faut utiliser update
   *
   * @param user
   * @param creation
   */
  createOrUpdate(user: Partial<User>, creation: boolean = false): any {
    const userClean = this.removeEmptyProperties(user);
    return this.usersRef.doc(userClean.id).set(userClean).then(user => console.log('user creer'))
  }

  delete(id: string): Promise<void> {
    return this.usersRef.doc(id).delete()
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
