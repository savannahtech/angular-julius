import {Component, ViewChild} from '@angular/core';
import {App, LoadingController, Nav, NavController, Platform, ToastController, PopoverController} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {LoginPage} from "../login/login";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {EventPage} from "../event/event";
import { PopoverPage } from '../popover/popover';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    @ViewChild(Nav) nav: Nav;

    public noRecords : Boolean;
    public country:string;
    countryData = {"country":"GH","lastId":1000000000000,"tag":"promoted"};
    events:any;
    ID : any;
    eventErrorData = {"text":""};
    public hidden : Boolean;
    public noTicket : Boolean = true;
    public user_id : any;
    public token : any;
    public total_tickets : any;

  constructor(public navCtrl: NavController, public storage : Storage, public http: HttpClient, public platform: Platform,
              public toastCtrl: ToastController, public loadingCtrl: LoadingController, public app: App, private popoverCtrl: PopoverController) {
      this.noRecords = false;
      this.hidden = false;

      this.platform.ready().then(() => {
          this.loadData("GH");
      });

    this.storage.get('sTUserData')
        .then((res)=>{
          if(res){
              this.user_id = res.userData.user_id;
              this.token = res.userData.token;
              this.countTickets();
          }
          else{
            this.navCtrl.setRoot(LoginPage);
          }
        })
  }

    countTickets(){
        let url = 'https://koliko.io/apps/sticket/get-num-tickets.php?userId='+this.user_id+'&token='+this.token;
        // let url = 'https://pesewawebsoft.com/apps/sticket/get-num-tickets.php?userId='+this.user_id+'&token='+this.token;
        let data:Observable<any> = this.http.get(url);
        data.subscribe(result => {

                let total = result;
                let dataLength = total.length;
                let ID = total[dataLength - 1].id;
                if(ID < 0){
                    this.noTicket = true;
                    this.presentToast(total[dataLength - 1].text);

                }
                else if(ID == 0){
                    this.noTicket = true;
                }
                else{
                    this.total_tickets = result;
                    this.noTicket = false;
                }
            },
            err =>{
                this.presentToast('No or slow internet connection');
            });
    }

    presentToast(msg){
        let toast = this.toastCtrl.create({
            message : msg,
            duration : 5000,
            position : "bottom"
        });

        toast.present();
    }

    getTickets(){
    }

    loadData(country){

        let loading = this.loadingCtrl.create({
            content: 'Loading matches...'
        });

        loading.present();
        let url = 'https://koliko.io/apps/sticket/get-events.php?country='+country+'&lastId='+this.countryData.lastId+'&tag='+this.countryData.tag;
        //let url = 'https://pesewawebsoft.com/apps/sticket/get-events.php?country='+country+'&lastId='+this.countryData.lastId+'&tag='+this.countryData.tag;
        let data:Observable<any> = this.http.get(url);
        data.subscribe(result => {
                loading.dismiss();

                this.events = result;
                let dataLength = this.events.length;
                this.ID = this.events[dataLength - 1].id;
                if(this.ID != 0){
                    this.countryData.lastId = this.ID;
                    this.hidden = false;
                }
                else{
                    this.hidden = true;
                }
            },
            err =>{
                loading.dismiss();
                this.presentToast('No or slow internet connection');
            })
    }

    doRefresh(refresher) {
        this.countryData.lastId = 10000000000000000;
        setTimeout(() => {
            let url = 'https://koliko.io/apps/sticket/get-events.php?country='+this.countryData.country+'&lastId='+this.countryData.lastId+'&tag='+this.countryData.tag;
            //let url = 'https://pesewawebsoft.com/apps/sticket/get-events.php?country='+this.countryData.country+'&lastId='+this.countryData.lastId+'&tag='+this.countryData.tag;
            let data:Observable<any> = this.http.get(url);
            data.subscribe(result => {

                    this.events = result;
                    let dataLength = this.events.length;
                    this.ID = this.events[dataLength - 1].id;
                    if(this.ID != 0){
                        this.countryData.lastId = this.ID;
                        this.hidden = false;
                    }
                    else{
                        this.hidden = true;
                    }
                },

                err =>{
                    this.presentToast('No or slow internet connection');
                })
            refresher.complete();
        }, 2000);
    }

    doInfinite(): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(() => {

                let url = 'https://koliko.io/apps/sticket/get-events.php?country='+this.countryData.country+'&lastId='+this.countryData.lastId+'&tag='+this.countryData.tag;
                //let url = 'https://pesewawebsoft.com/apps/sticket/get-events.php?country='+this.countryData.country+'&lastId='+this.countryData.lastId+'&tag='+this.countryData.tag;
                let data:Observable<any> = this.http.get(url);
                data.subscribe(result => {
                        const  newData = result;
                        this.countryData.lastId = newData[newData.length - 1].id;
                        if(this.countryData.lastId != 0){
                            this.events.push(newData);
                        }
                        else {
                            this.noRecords = true;
                        }
                    },
                    err =>{
                        this.presentToast('No or slow internet connection');
                    });

                resolve();
            }, 500);
        })
    }

    public viewEvent(event ,item ){
        this.app.getRootNav().push(EventPage,{
            item:item
        });
    }

    presentPopover(myEvent) {
        let popover = this.popoverCtrl.create(PopoverPage);
        popover.present({
          ev: myEvent
        });
      }
}
