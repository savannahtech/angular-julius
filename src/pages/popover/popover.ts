import { CartPage } from './../cart/cart';
import { TicketsPage } from './../tickets/tickets';
import { NewsPage } from './../news/news';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private storage: Storage, 
    private iab: InAppBrowser) {
  }


  goToTickets(){
    this.navCtrl.push(TicketsPage);
  }

  goToNews(){
    this.iab.create('https://www.ghanafa.org/category/news');
  }

  goToCart(){
    this.navCtrl.push(CartPage)
  }

  logOut() {
    let alert = this.alertCtrl.create({
      title: 'Log Out!',
      message: "Are you sure you want to log out?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text : "Log Out",
          handler:()=>{
            this.storage.clear();
            this.navCtrl.setRoot(LoginPage)
          }
        }
      ]
    });
    alert.present();
  }
}
