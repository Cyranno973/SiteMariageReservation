import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {Choice, Status, User} from "../../model/user";
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

  importOrCreateUser(listUser?: Partial<User>[], user?: Partial<User>) {
    if (listUser?.length) listUser.map(user => this.createObjUser(user))
    else if (user) this.createObjUser(user)
  }

  createOrUpdateUser(user: Partial<User>): Promise<User> {
    let userClean: User;
    if (!user.id) {
      return this.generatorIdentifiant()
        .then(id => {
         userClean = this.removeEmptyProperties({ ...user, id }) as User;
         this.usersRef.doc(userClean.id).set(userClean);
        return userClean
        });
    } else return this.update(user);

  }

  update(user: Partial<User>): Promise<User> {
    const userClean = this.removeEmptyProperties(user) as User;
    return this.usersRef.doc(userClean.id).update(userClean).then(user => { return userClean })
  }

  private createObjUser(user: Partial<User>) {
    user.statusUser = user.statusUser || Status.First;
    user.choice = user.choice || Choice.All;
    user.organisation = user.organisation || false;
    user.selectedCategory = "Adulte";
    user.accompaniement =  user.accompaniement || [];
    return this.createOrUpdateUser(user);
  }
  updateAllUsersWithNewProperty(): void {
    this.getAll().subscribe(users => {
      const res = users.reduce((acc:number, user:Partial<User>) => user? acc+1: acc+0, 0)
      console.log(res);
      users.forEach((user: Partial<User>) => {
        user.selectedCategory = "Adulte";
        // user.organisation = false;
        // console.log(user)// Ajoutez la nouvelle propriété à chaque utilisateur
        this.update(user); // Mettez à jour l'utilisateur dans Firebase
      });
    });
  }

  private generatorIdentifiant(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const generateId = (): string => {
        return Math.floor(Math.random() * (999999 - 111111) + 111111).toString();
      };

      const checkId = (id: string): void => {
        if (id === '99999' || id === '111111') { return checkId(generateId());}
        this.getById(id).subscribe(user => {
          if (user.exists) checkId(generateId());
          else resolve(id);
        }, err => reject(err));
      };
      checkId(generateId());
    });
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
