import {Media} from "../../model/media";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AbstractCrudFichier} from "./AbstractCrudFichier";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class MediaActivityService extends AbstractCrudFichier<Media> {
  constructor(db: AngularFirestore) {
    super(db, '/mediaActivity');
  }
}
