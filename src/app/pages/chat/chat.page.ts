/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication.service';
import { ChatService } from '../../services/chat.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as crypto from 'crypto-js';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

interface messageData {
  Name: string;
  Message: string;
  CreateDate: Date;
  Image: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  @ViewChild('content') content: any;
  messageList = [];
  messageData: messageData;
  messageForm: FormGroup;

  userEmail: string;
  passEnc: string;

  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  UploadedFileURL: Observable<string>;

  fileName: string;
  fileSize: number;

  isUploading: boolean;
  isUploaded: boolean;

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticationService,
    private chatService: ChatService,
    private storage: AngularFireStorage,
    private database: AngularFirestore
  ) {
    this.messageData = {} as messageData;
    this.isUploading = false;
    this.isUploaded = false;
  }

  ngOnInit() {
    this.passEnc = '123456';
    this.authService.userDetails().subscribe(res => {
      console.log('res', res);
      if (res !== null) {
        this.messageData.Name = res.email;
      } else {
        this.navCtrl.navigateBack('');
      }
    }, err => {
      console.log('err', err);
    });

    this.chatService.read_messages().subscribe(data => {
      console.log("Al inicio", this.messageList);
      this.messageList = data.map(e => {
        if(e.payload.doc.data()['Image']){
          return {
            id: e.payload.doc['id'],
            isEdit: false,
            Name: e.payload.doc.data()['Name'],
            Message:crypto.AES.decrypt(e.payload.doc.data()['Message'], this.passEnc).toString(crypto.enc.Utf8),
            Image: crypto.AES.decrypt(e.payload.doc.data()['Image'], this.passEnc).toString(crypto.enc.Utf8),
          };
        }
        return {
          id: e.payload.doc['id'],
          isEdit: false,
          Name: e.payload.doc.data()['Name'],
          Message:crypto.AES.decrypt(e.payload.doc.data()['Message'], this.passEnc).toString(crypto.enc.Utf8)
        };
      });

    });

  }

  CreateRecord() {
    this.passEnc = '123456';
    this.messageData.CreateDate = new Date();
    this.messageData.Message = crypto.AES.encrypt(this.messageData.Message, this.passEnc).toString();
    console.log(this.messageData.Message + ' Encriptado');

    this.chatService.create_message(this.messageData)
      .then(resp => {
        this.messageData.Message = null;
      })
      .catch(error => {
        console.log(error);
      });
  }

  logout() {
    this.authService.logout()
      .then(res => {
        console.log(res);
        this.navCtrl.navigateBack('');
      })
      .catch(error => {
        console.log(error);
      });
  }


  uploadFile(event: FileList) {

    const file = event.item(0);

    if (file.type.split('/')[0] !== 'image') {
     console.error('Archivo no soportado');
     return;
    }

    this.isUploading = true;
    this.isUploaded = false;


    this.fileName = file.name;

    const path = `${new Date().getTime()}_${file.name}`;
    const customMetadata = { app: 'Freaky Image Upload Demo' };
    const fileRef = this.storage.ref(path);

    this.task = this.storage.upload(path, file, { customMetadata });

    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      finalize(() => {
        this.passEnc = '123456';
        this.UploadedFileURL = fileRef.getDownloadURL();
        this.UploadedFileURL.subscribe(resp=>{
          this.messageData.Image = crypto.AES.encrypt(resp, this.passEnc).toString();
        },error=>{
          console.error(error);
        });
      })
    );
  }

}
