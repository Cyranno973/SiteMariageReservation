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
      timestamp: Date.now() // Storing the timestamp in milliseconds
    };

    return this.logRef.add(logEntry)
      .then(() => {
        return this.cleanupLogs();
      });
  }

  getAllLogs(): Observable<any[]> {
    return this.logRef.snapshotChanges().pipe(
      map(changes => changes.map(c => ({ ...c.payload.doc.data(), id: c.payload.doc.id })))
    );
  }

  private async cleanupLogs(): Promise<void> {
    const logsRef = this.db.collection('logs');

    const allLogsSnapshot = await logsRef.get().toPromise();

    if (allLogsSnapshot!.size > 200) {
      const logsToDelete = allLogsSnapshot!.docs.slice(0, allLogsSnapshot!.size - 200);
      for (const log of logsToDelete) {
        await log.ref.delete();
      }
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Convert the date to a timestamp in milliseconds for comparison
    const thirtyDaysAgoTimestamp = thirtyDaysAgo.getTime();

    const oldLogsSnapshot = await logsRef.ref.where('timestamp', '<', thirtyDaysAgoTimestamp).get();
    for (const log of oldLogsSnapshot.docs) {
      await log.ref.delete();
    }
  }
}
