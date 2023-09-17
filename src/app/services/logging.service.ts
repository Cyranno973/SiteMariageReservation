import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  private logRef: AngularFirestoreCollection<any>;
  private logDbPath = '/logs';

  constructor(private db: AngularFirestore) {
    this.logRef = db.collection(this.logDbPath);
  }

  log(message: string, type: string = 'info'): Promise<void> {
    const logEntry = {
      message: message,
      type: type,
      timestamp: new Date().toISOString()
    };

    return this.logRef.add(logEntry)
      .then(() => {
        return this.cleanupLogs();
      });
  }

  getAllLogs(): Observable<any[]> {
    return this.logRef.snapshotChanges().pipe(
      map(changes => changes.map(c => ({...c.payload.doc.data(), id: c.payload.doc.id})))
    );
  }

  private async cleanupLogs(): Promise<void> {
    const logsRef = this.db.collection('logs'); // Assurez-vous que 'logs' est le nom correct de votre collection de logs.
    const allLogsSnapshot = await logsRef.get().toPromise();

    // Si le nombre total de logs dépasse 200
    if (allLogsSnapshot!.size > 200) {
      const logsToDelete = allLogsSnapshot!.docs.slice(0, allLogsSnapshot!.size - 200);
      for (const log of logsToDelete) {
        await log.ref.delete();
      }
    }

    // Supprimer les logs de plus de 30 jours
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const oldLogsSnapshot = await logsRef.ref.where('timestamp', '<', thirtyDaysAgo).get();
    for (const log of oldLogsSnapshot.docs) {
      await log.ref.delete();
    }
  }

}
