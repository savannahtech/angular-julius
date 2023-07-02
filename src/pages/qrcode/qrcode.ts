import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-qrcode',
  templateUrl: 'qrcode.html',
})
export class QrcodePage {
  public ticketData : any;
  public created_code= null;
  eventName : any;
  quantity : any;
  eventDate : any;
  resultData : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage,
    private alertCtrl: AlertController) {
    this.storage.get('sTTicketData').then((result) => {
      if(result){
          this.ticketData = result;
          this.eventName = this.ticketData.eventName;
          this.quantity = this.ticketData.quantity;
          this.eventDate = this.ticketData.date;

          this.created_code = JSON.stringify(this.ticketData);

      }
      else{
        this.navCtrl.setRoot(HomePage);
      }
    })
  }

  presentConfirm(message) {
    let alert = this.alertCtrl.create({
      title: 'Error!',
      message: message,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    alert.present();
  }

}
