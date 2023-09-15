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

  createUSerPartial(listUser?: Partial<User>[], user?: Partial<User>) {
    if (listUser?.length) listUser.map(user => this.creationUser(user,true))
    else if (user) this.creationUser(user, false)
  }

  createOrUpdate(user: Partial<User>, creation: boolean = false): Promise<User> {
    let userClean: User;
    if (creation) {
      return this.generatorIdentifiant().then(id => {
         userClean = this.removeEmptyProperties({ ...user, id }) as User;
        return this.usersRef.doc(userClean.id).set(userClean);
      }).then(() => userClean)
        // .catch((err) => console.log(err));
    } else {
      const userClean = this.removeEmptyProperties(user) as User;
      return this.usersRef.doc(userClean.id).set(userClean).then(() => userClean);
    }
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

  update(user: Partial<User>): any {
    const userClean = this.removeEmptyProperties(user);
    return this.usersRef.doc(userClean.id).update(userClean).then(user => {
      //console.log('user creer')
    })
  }

  private creationUser(user: Partial<User>, idInTheList:boolean) {
    user.statusUser = user.statusUser || Status.First;
    user.choice = user.choice || Choice.All;
    user.organisation = user.organisation || false;
    user.selectedCategory = "Adulte";

    const accompaniement = user.accompaniement || []; // Initialiser accompaniement avec un tableau vide s'il n'est pas fourni
    user.accompaniement = accompaniement;
    // console.log(user)
    return idInTheList ? this.createOrUpdate(user, false): this.createOrUpdate(user, true);
  }

  private generatorIdentifiant(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const generateId = (): string => {
        return Math.floor(Math.random() * (999999 - 111111) + 111111).toString();
      };

      const checkId = (id: string): void => {
        if (id === '99999' || id === '111111') {
          return checkId(generateId());
        }

        this.getById(id).subscribe(user => {
          if (user.exists) {
            checkId(generateId());
          } else {
            resolve(id);
          }
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
