import {Injectable} from '@angular/core';
import {AngularFireMessaging} from "@angular/fire/compat/messaging";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {User} from "../../model/user";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private afMessaging: AngularFireMessaging,
    private afs: AngularFirestore
  ) {
  }

  // Demande la permission et enregistre le token
  requestPermission(user: User): Promise<void> {
    return new Promise((resolve, reject) => {
      this.afMessaging.requestToken.subscribe(
        (token: any) => {
          console.log('Permission granted! Save to the server!', token);
          this.saveToken(user, token).then(resolve).catch(reject);
        },
        (error: string) => {
          console.error('Unable to get permission to notify.', error);
          reject(error);
        }
      );
    });
  }

  // Enregistre le token dans Firestore
  async saveToken(user: User, token: string): Promise<void> {
    const currentTokens = user.fcmTokens || [];

    // Vérifie si le token existe déjà pour cet utilisateur
    if (!currentTokens.includes(token)) {
      currentTokens.push(token);
    }

    return this.afs.collection('users').doc(user.id).update({ fcmTokens: currentTokens });
  }

}

