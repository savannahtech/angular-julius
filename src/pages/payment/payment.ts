import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { HomePage } from './../home/home';
import { LoginPage } from './../login/login';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { QrcodePage } from '../qrcode/qrcode';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';


@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  public ticket_user_id : any;
  public ticketData : any;
  resultData : any;
  public quantity : any;
  public products: any;
  public paymentData = {"user_id":"","token":"","amount":"", "account_name":"", "number":"", "payment_type":"", "products":{}, "voucher":""};


  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage,
    private alertCtrl: AlertController, private loadingCtrl: LoadingController, private authService: AuthServiceProvider,
    private toastCtrl: ToastController, private sqlite: SQLite) {
      this.paymentData.amount = this.navParams.get('total');
    this.storage.get('sTUserData')
    .then((res)=>{
      if(res){
        this.paymentData.account_name = res.userData.username;
        this.paymentData.user_id = res.userData.user_id;
        this.paymentData.token = res.userData.token;
        this.getCartData();

      }
      else{
        this.navCtrl.setRoot(LoginPage);
      }
    })

  }

  confirmPayment(type) {

    if(type == 'VDF'){
      let alert = this.alertCtrl.create({
        title: "Make Payment",
        message: 'Enter your wallet number and voucher number. A prompt will be sent for you to confirm.',
        inputs: [
          {
            name: 'momoNumber',
            type: 'number',
            label: 'VCash Number',
            placeholder: "VCash number"
          },
          {
            name: 'voucher',
            type: 'text',
            label: 'Voucher Number',
            placeholder: 'Voucher number'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancelled');
            }
          },
          {
            text: 'Proceed',
            handler: (data) => {
              if((data.momoNumber == "" || data.momoNumber == null || data.momoNumber == ' ') && (data.voucher == "" || data.voucher == null || data.voucher == ' ')){
                this.presentToast("Enter your wallet number and voucher")
              }
              else{
                let loading = this.loadingCtrl.create({
                  content: 'processing...'
                });

                loading.present();

                this.paymentData.number = data.momoNumber;
                this.paymentData.payment_type = type;
                this.paymentData.voucher = data.voucher;

                this.authService.postData(this.paymentData,'payment').then((result) => {
                  loading.dismiss();
                  this.resultData = result;
                  console.log(this.resultData);
                  if(this.resultData.success){
                    this.navCtrl.push(QrcodePage)
                  }
                  else  {
                    this.storage.set('sTError', this.resultData);
                    setTimeout(() => this.storage.get('sTError').then(data=> {
                      if (data) {

                        let errorDetails = data.error;
                        this.presentConfirm(errorDetails.text);
                      }
                    }), 1000);
                  }

                }, (err) => {
                  loading.dismiss();

                  this.presentConfirm("No or slow internet connection "+err)
                });
              }

            }
          }
        ]
      });
      alert.present();
    }
    else{
      let alert = this.alertCtrl.create({
        title: "Make Payment",
        message: 'Enter your wallet number and a prompt will be sent to you for you to confirm. Be sure to accept before a minute pass.',
        inputs: [
          {
            name: 'momoNumber',
            type: 'number',
            label: 'Momo Number',
            placeholder: 'Momo Number',
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancelled');
            }
          },
          {
            text: 'Proceed',
            handler: (data) => {
              if(data.momoNumber == "" || data.momoNumber == null || data.momoNumber == ' '){
                this.presentToast("Enter your wallet number")
              }
              else{
                let loading = this.loadingCtrl.create({
                  content: 'processing...'
                });


                loading.present();

                this.paymentData.number = data.momoNumber;
                this.paymentData.payment_type = type;

                this.authService.postData(this.paymentData,'payment').then((result) => {
                  loading.dismiss();
                  this.resultData = result;
                  console.log(this.resultData);
                  if(this.resultData.success){
                    this.navCtrl.push(QrcodePage)
                  }
                  else  {
                    this.storage.set('sTError', this.resultData);
                    setTimeout(() => this.storage.get('sTError').then(data=> {
                      if (data) {

                        let errorDetails = data.error;
                        this.presentConfirm(errorDetails.text);
                      }
                    }), 1000);
                  }
                }, (err) => {
                  loading.dismiss();

                  this.presentConfirm("No or slow internet connection "+err)
                });
              }

            }
          }
        ]
      });
      alert.present();
    }

  }

  presentToast(msg){
    let toast = this.toastCtrl.create({
      message : msg,
      duration : 5000,
      position : "bottom"
    });

    toast.present();
  }

  presentConfirm(message) {
    let alert = this.alertCtrl.create({
      message: message,
      title: 'Error',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            console.log('Cancelled');
          }
        }
      ]
    });
    alert.present();
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
                  this.presentToast('No data found');
                  this.navCtrl.setRoot(HomePage)
              }
              else{
                 // this.noData = false;
                  this.products = [];


                  for(var i=0; i<totalItems; i++) {
                     
                      this.products.push({event_id:res.rows.item(i).event_id, type:res.rows.item(i).type, quantity:res.rows.item(i).quantity, total:res.rows.item(i).total, date:res.rows.item(i).date, eventName:res.rows.item(i).eventName, affiliation:res.rows.item(i).affiliation});
                      //console.log(JSON.stringify(this.totalAmount));

                  }

                  this.paymentData.products = this.products;
              }
          })
          .catch(e => console.log(e));
  }).catch(e => console.log(e));
  }
}
