import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { LoginPage } from '../login/login';
import { ViewTicketPage } from '../view-ticket/view-ticket';

@Component({
  selector: 'page-tickets',
  templateUrl: 'tickets.html',
})
export class TicketsPage {
  logged :Boolean =  false;
  userData = {"user_id":"", "last_id":0};
  ticketData : any;
  items : any;
  errorDetails : any;
  noData : Boolean = false;
  ID : any;
  public noRecords : Boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private loadingCtrl: LoadingController,
    public http: HttpClient, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.getTicket();
  }

  getTicket(){
    this.storage.get('sTUserData')
    .then((res) => {
      if(res){
        this.logged = true;
        this.userData.user_id = res.userData.user_id;
        let loading = this.loadingCtrl.create({
          content: 'Loading tickets...'
        });

        loading.present();
        let url = 'https://koliko.io/apps/sticket/get-user-tickets.php?user_id='+this.userData.user_id+'&lastId='+this.userData.last_id;
        //let url = 'https://pesewawebsoft.com/apps/sticket/get-user-tickets.php?user_id='+this.userData.user_id+'&lastId='+this.userData.last_id;
        let data:Observable<any> = this.http.get(url);
        data.subscribe(result => {
          loading.dismiss();

          this.items = result;
          let dataLength = this.items.length;
          this.ID = this.items[dataLength - 1].id;
          if(this.ID != 0){
            this.userData.last_id = this.ID;
            this.noData = false;
          }
          else{
            this.noData = true;
          }
        })
      }
      else{
        this.logged = false;
      }
    })
  }

  goToLogin(){
    this.navCtrl.push(LoginPage, {page : "TicketsPage"})
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

  doRefresh(refresher) {
    setTimeout(() => {
      let url = 'https://koliko.io/apps/sticket/get-user-tickets.php?user_id='+this.userData.user_id+'&lastId='+this.userData.last_id;
      //let url = 'https://pesewawebsoft.com/apps/sticket/get-user-tickets.php?user_id='+this.userData.user_id+'&lastId='+this.userData.last_id;
        let data:Observable<any> = this.http.get(url);
        data.subscribe(result => {

          this.items = result;
          let dataLength = this.items.length;
          this.ID = this.items[dataLength - 1].id;
          if(this.ID != 0){
            this.userData.last_id = this.ID;
            this.noData = false;
          }
          else{
            this.noData = true;
          }
        })
      refresher.complete();
    }, 2000);
  }

  doInfinite(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {

        let url = 'https://koliko.io/apps/sticket/get-user-tickets.php?user_id='+this.userData.user_id+'&lastId='+this.userData.last_id;
        //let url = 'https://pesewawebsoft.com/apps/sticket/get-user-tickets.php?user_id='+this.userData.user_id+'&lastId='+this.userData.last_id;
        let data:Observable<any> = this.http.get(url);
        data.subscribe(result => {
          const  newData = result;
          this.userData.last_id = newData[newData.length - 1].id;
          if(this.userData.last_id != 0){
            this.items.push(newData);
          }
          else {
            this.noRecords = true;
          }
        });

        resolve();
      }, 500);
    })
  }

  viewTicket(item){
    this.navCtrl.push(ViewTicketPage, {ticket : item})
  }
}
