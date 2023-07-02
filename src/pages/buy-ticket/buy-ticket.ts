import { Component } from '@angular/core';
import {AlertController, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {PaymentPage} from "../payment/payment";
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-buy-ticket',
  templateUrl: 'buy-ticket.html',
})
export class BuyTicketPage {

  ticketData = {"user_id":"", "token":"", "eventId":"", "type":"standard","quantity":1,"total":0,"date":"", "eventName":"", "affiliation":"home"};
  eventName : any;
  standardPrice : any;
  vipPrice : any;
  quantity : number = 1;
  totalAmt : any = 0;
  vipTicket : any = 0;
  standardTicket : any = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, public view : ViewController, public alertCtrl : AlertController, public toastCtrl : ToastController, 
    public storage : Storage, public sqlite: SQLite) {
  }

  ionViewDidLoad() {
    this.ticketData.user_id = this.navParams.get('userId');
    this.ticketData.eventId = this.navParams.get('eventId');
    this.ticketData.token = this.navParams.get('token');
    this.eventName = this.navParams.get('eventName');
    this.standardPrice = this.navParams.get('standardPrice');
    this.vipPrice = this.navParams.get('vipPrice');
    this.totalAmt = this.navParams.get('standardPrice');
    this.vipTicket = this.navParams.get('vipTicket');
    this.standardTicket = this.navParams.get('standardTicket');
    this.ticketData.date = this.navParams.get('eventDate');
  }

  closeModal(){
    this.view.dismiss();
  }


  presentConfirm() {
    let alert = this.alertCtrl.create({
      message: 'Are you sure you want to purchase this ticket?',
      buttons: [
        {
          text: 'N0',
          role: 'cancel',
          handler: () => {
            console.log('Cancelled');
          }
        },
        {
          text: 'YES',
          handler: () => {
            this.ticketData.quantity = this.quantity;
            this.ticketData.total = this.totalAmt;
            this.ticketData.eventName = this.eventName;

            this.storage.set('sTTicketData', this.ticketData);
            //this.navCtrl.push(QrcodePage);
            //this.navCtrl.push(PaymentPage);
            this.sqlite.create({
              name: 'sticket.db',
              location: 'default'
          }).then((db: SQLiteObject) => {
              db.executeSql('SELECT * FROM ticket WHERE event_id =?',[this.ticketData.eventId])
                  .then(result => {
                      if(result.rows.length > 0){
                          let quan = result.rows.item(0).quantity;
                          let tot = result.rows.item(0).total;
                          let newQuan = parseInt(quan) + this.quantity;
                          let newTot = parseFloat(tot) + parseFloat(this.totalAmt);
                          db.executeSql('UPDATE ticket SET quantity = ?, total = ? WHERE event_id = ?',[newQuan, newTot, this.ticketData.eventId])
                              .then(res => {
                                  this.presentToast('Ticket added to chart');
                                  //this.cartEmpty = false;
                                  this.closeModal();
                                  this.navCtrl.setRoot(HomePage)
                              })
                              .catch(e => {
                                  this.presentToast("Error updating cart");
                              });
                      }
                      else{
                          db.executeSql('INSERT INTO ticket(event_id,type,quantity,total,date,eventName,affiliation) VALUES(?,?,?,?,?,?,?)',
                              [this.ticketData.eventId,this.ticketData.type,this.ticketData.quantity,this.ticketData.total,this.ticketData.date,this.ticketData.eventName,this.ticketData.affiliation])
                              .then(res => {
                                  this.presentToast('Item added to chart');
                                  //this.cartEmpty = false;
                                  this.closeModal();
                                  this.navCtrl.setRoot(HomePage)
                              })
                              .catch(e => {
                                  this.presentToast("Error adding item");
                              });
                      }
                  })
                  .catch(e => {
                      this.presentToast(e);
                      console.log("select error "+e)
                  });
          }).catch(e => {
              console.log("database error "+e);
              this.presentToast(e);
          });
          }
        }
      ]
    });
    alert.present();
  }


  increaseQuantity(){
    //check ticket type
    if(this.ticketData.type == "standard"){
      if(this.ticketData.quantity > this.standardTicket){
        this.presentToast("Maximum tickets reached")
      }
      else if(this.ticketData.quantity > 6){
        this.presentToast("You can only buy 6 tickets.")
      }
      else{
        this.quantity ++;
        this.totalAmt = this.quantity * parseFloat(this.standardPrice)
      }
    }
    
    else{
      if(this.ticketData.quantity > this.vipTicket){
        this.presentToast("Maximum tickets reached")
      }
      else if(this.ticketData.quantity > 4){
        this.presentToast("You can only buy 4 tickets.")
      }
      else{
        this.quantity ++;
        this.totalAmt = this.quantity * parseFloat(this.vipPrice)
      }
    }
  }

  decreaseQuantity(){

    if(this.quantity == 1){
      this.presentToast("Minimum tickets reached")
    }
    else{
      if(this.ticketData.type == "standard"){
        this.quantity --;
        this.totalAmt = this.quantity * parseFloat(this.standardPrice)
      }
      
      else{
        this.quantity --;
        this.totalAmt = this.quantity * parseFloat(this.vipPrice)
      }
    }
  }

  presentToast(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

  onChange(value){
    if(value == 'standard'){
      this.totalAmt = this.quantity * parseFloat(this.standardPrice)
    }
    else{
      this.totalAmt = this.quantity * parseFloat(this.vipPrice)
    }
  }
}
