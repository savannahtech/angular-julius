import { PaymentPage } from './../payment/payment';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  public noData : Boolean = true;
  public totalAmount : any;
  public products : any[];
 
  public user_id : any;
  public token : any;
  
  public total : any;
 
  public ID : any;
  public items : any;
  public subtotal : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public sqlite: SQLite, public toastCtrl: ToastController,
    public alertCtrl: AlertController) {
      storage.get('sTUserData')
        .then((res)=>{
          if(res){
              this.user_id = res.userData.user_id;
              this.token = res.userData.token;
              //this.countTickets();
              this.getCartData();
          }
          else{
            this.navCtrl.setRoot(LoginPage);
          }
        })
  }

  getCartData(){
    this.sqlite.create({
      name: 'sticket.db',
      location: 'default'
  }).then((db: SQLiteObject) => {

      db.executeSql('SELECT * FROM ticket',[])
          .then(res => {
              let totalItems = res.rows.length;
              if(totalItems == 0){
                  this.noData = true;
              }
              else{
                  this.noData = false;
                  this.totalAmount = 0;
                  this.products = [];


                  for(var i=0; i<totalItems; i++) {
                      //let quantity =  parseInt(res.rows.item(i).quantity);
                      let price = parseFloat(res.rows.item(i).total);
                      this.totalAmount = this.totalAmount + price;
                      
                      this.products.push({ticketid:res.rows.item(i).ticketid, event_id:res.rows.item(i).event_id, type:res.rows.item(i).type, quantity:res.rows.item(i).quantity, total:res.rows.item(i).total, date:res.rows.item(i).date, eventName:res.rows.item(i).eventName, affiliation:res.rows.item(i).affiliation});
                      //console.log(JSON.stringify(this.totalAmount));

                  }

                  
                  this.total = parseFloat(this.totalAmount);

              }
          })
          .catch(e => console.log(e));
  }).catch(e => console.log(e));
  }

  clearCart(){
    let alert = this.alertCtrl.create({
      title: "Clear Cart",
      message: "Do you want to clear items in your cart?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.sqlite.create({
              name: 'sticket.db',
              location: 'default'
            }).then((db: SQLiteObject) => {

              db.executeSql('DELETE FROM ticket',[])
                  .then(res => {
                    this.noData = true;
                    this.total = 0;
                    this.totalAmount = 0;
                  })
                  .catch(e => console.log(e));
            }).catch(e => console.log(e));
          }
        }
      ]
    });
    alert.present();

  }

  
  presentToast(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

  presentConfirm(message) {
    let alert = this.alertCtrl.create({
        title: "Error",
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

  deleteItem(itemid, index){

    let price = parseFloat(this.products[index].total);


    this.sqlite.create({
      name: 'sticket.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('DELETE FROM ticket WHERE event_id=?',[itemid])
          .then(res => {
            //console.log(res);
            //this.presentToast("item deleted");

                  db.executeSql('SELECT * FROM ticket',[])
                      .then(res => {
                          let totalItems = res.rows.length;
                          if(totalItems == 0){
                              this.noData = true;
                          }
                          else{
 
                             

                              this.totalAmount = this.totalAmount - price;
                              
                              this.total = parseFloat(this.totalAmount);

                              

                              this.products.splice(index, 1);
                              //this.total = this.totalAmount + parseFloat(this.deliveryFee);
                              //this.cashOnDev = parseFloat(this.total) + 3;

                          }
                      })
                      .catch(e => console.log(e));

          })
          .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

  goToPayment(){
    this.navCtrl.push(PaymentPage, {total: this.total});
  }
}
