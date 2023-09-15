import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {Choice, Status, User} from "../../model/user";
import {map, Observable} from "rxjs";
import {LoggingService} from "./logging.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private dbPath = '/users';
  private usersRef: AngularFirestoreCollection<User>;

  constructor(private db: AngularFirestore, private loggingService: LoggingService) {
    this.usersRef = db.collection(this.dbPath);

  }

  getAll(): Observable<any> {
    this.loggingService.log('Fetching all users.');
    return this.usersRef.snapshotChanges().pipe(
      map(changes => changes.map(c => ({...c.payload.doc.data(), id: c.payload.doc.id})))
    );
  }


  getById(id: string): Observable<any> {
    this.loggingService.log(`Fetching user with ID ${id}.`);
    return this.usersRef.doc(id).get();
  }


  importOrCreateUser(listUser?: Partial<User>[], user?: Partial<User>) {
    if (listUser?.length) listUser.map(user => this.createObjUser(user))
    else if (user) this.createObjUser(user)
  }

  createOrUpdateUser(user: Partial<User>): Promise<User> {
    let userClean: User = this.removeEmptyProperties(user) as User;

    if (!user.id) {
      return this.generatorIdentifiant()
        .then(id => {
          userClean.id = id; // Assign the generated ID to userClean.
          return this.usersRef.doc(userClean.id).set(userClean);
        })
        .then(() => {
          this.loggingService.log(`User with ID ${userClean.id} created.`);
          return userClean;
        })
        .catch(error => {
          this.loggingService.log(`Error creating user with ID ${userClean.id}: ${error.message}`, 'error');
          throw error;
        });
    } else {
      return this.getById(user.id).toPromise()
        .then(userExist => {
          const docRef = this.usersRef.doc(userClean.id);

          if (userExist.exists) {
            this.loggingService.log(`Updating user with ID ${userClean.id}.`);
            return docRef.update(userClean);
          } else {
            this.loggingService.log(`User with ID ${userClean.id} not found. Creating a new one.`);
            return docRef.set(userClean);
          }
        })
        .then(() => {
          this.loggingService.log(`User with ID ${userClean.id} successfully updated or created.`);
          return userClean;
        })
        .catch(error => {
          this.loggingService.log(`Error updating or creating user with ID ${userClean.id}: ${error.message}`, 'error');
          throw error;
        });
    }
  }


  update(user: Partial<User>): Promise<User> {
    const userClean = this.removeEmptyProperties(user) as User;
    return this.usersRef.doc(userClean.id).update(userClean)
      .then(() => {
        this.loggingService.log(`User with ID ${userClean.id} updated.`);
        return userClean;
      })
      .catch(error => {
        this.loggingService.log(`Error updating user with ID ${userClean.id}: ${error.message}`, 'error');
        throw error;
      });
  }

  updateAllUsersWithNewProperty(): void {
    this.loggingService.log('Starting to update all users with new property.');

    this.getAll().subscribe(users => {
      const totalUsers = users.length;
      let updatedUsersCount = 0;

      users.forEach((user: Partial<User>) => {
        user.selectedCategory = "Adulte";
        this.update(user)
          .then(() => {
            updatedUsersCount += 1;
            this.loggingService.log(`Updated user with ID ${user.id}.`);

            if (updatedUsersCount === totalUsers) {
              this.loggingService.log('All users updated with new property.');
            }
          })
          .catch(error => {
            this.loggingService.log(`Error updating user with ID ${user.id}: ${error.message}`, 'error');
          });
      });
    });
  }

  delete(id: string): Promise<void> {
    return this.usersRef.doc(id).delete()
      .then(() => {
        this.loggingService.log(`User with ID ${id} successfully deleted.`);
      })
      .catch(error => {
        this.loggingService.log(`Error deleting user with ID ${id}: ${error.message}`, 'error');
        throw error;
      });
  }

  private createObjUser(user: Partial<User>) {
    user.statusUser = user.statusUser || Status.First;
    user.choice = user.choice || Choice.All;
    user.organisation = user.organisation || false;
    user.selectedCategory = "Adulte";
    user.accompaniement = user.accompaniement || [];
    return this.createOrUpdateUser(user);
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
          if (user.exists) checkId(generateId());
          else resolve(id);
        }, err => reject(err));
      };
      checkId(generateId());
    });
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
