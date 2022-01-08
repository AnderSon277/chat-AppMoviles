/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})

export class ChatService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  collectionName = 'messages';

  create_message(record) {
    console.log(record);

    return this.firestore.collection(this.collectionName).add(record);
  }

  read_messages() {
    return this.firestore.collection(this.collectionName, ref => ref.orderBy('CreateDate')).snapshotChanges();
  }

  update_message(recordID, record) {
    this.firestore.doc(this.collectionName + '/' + recordID).update(record);
  }

  delete_message(record_id) {
    this.firestore.doc(this.collectionName + '/' + record_id).delete();
  }

}
