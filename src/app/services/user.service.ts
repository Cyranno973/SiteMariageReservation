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


  createOrUpdate(user: Partial<User>, creation: boolean = false): any {
    if (creation) {
      return this.generatorIdentifiant().then(id => {
        const userClean = this.removeEmptyProperties({ ...user, id });
        return this.usersRef.doc(userClean.id).set(userClean);
      }).then(user => {
        // console.log('user created')
      });
    } else {
      const userClean = this.removeEmptyProperties(user);
      return this.usersRef.doc(userClean.id).set(userClean).then(user => {
        // console.log('user updated')
      });
    }
  }

  update(user: Partial<User>): any {
    const userClean = this.removeEmptyProperties(user);
    return this.usersRef.doc(userClean.id).update(userClean).then(user => {
      //console.log('user creer')
    })
  }

  // }
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

  //   return id
  /**avec firebase si on veut creer une collection avec un od personalisé il faut utiliser update
   -*+   * @param user
   * @param creation
   */

  // createOrUpdate(user: Partial<User>, creation: boolean = false): any {
  //   const userClean = this.removeEmptyProperties(user);
  //   return this.usersRef.doc(userClean.id).set(userClean).then(user => console.log('user creer'));
  // }
  createWithOutGeneratorIdentifiant(){

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


  // private creationUser(user: Partial<User>) {
  //   console.log(user)
  //   user.id = this.generatorIdentifiant();
  //   user.statusUser = Status.First;
  //   user.choice = Choice.All;
  //   user.accompaniement = [];
  //   return this.createOrUpdate(user, true);

  // }
  private creationUser(user: Partial<User>, idInTheList:boolean) {
   // console.log(user)
    // user.id = this.generatorIdentifiant();
    user.statusUser = user.statusUser || Status.First;
    user.choice = user.choice || Choice.All;

    const accompaniement = user.accompaniement || []; // Initialiser accompaniement avec un tableau vide s'il n'est pas fourni
    user.accompaniement = accompaniement;
   // console.log(user)
    return idInTheList ? this.createOrUpdate(user, false): this.createOrUpdate(user, true);
  }

  // private generatorIdentifiant(): string {
  //   const id = Math.floor(Math.random() * (999999 - 111111) + 111111).toString();
  //   if (id === '99999' || id === '111111') this.generatorIdentifiant()
  //   this.getById(id).subscribe(user => user.exists ? this.generatorIdentifiant() : id)

}
