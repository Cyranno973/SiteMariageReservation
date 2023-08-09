import {Media} from "../../model/media";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AbstractCrudFichier} from "./AbstractCrudFichier";

export class MediaActivityService extends AbstractCrudFichier<Media> {
  constructor(db: AngularFirestore) {
    super(db, '/mediaActivity');
  }
}
