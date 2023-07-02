import {Component, ViewChild} from '@angular/core';
import {AlertController, LoadingController, ModalController, NavController, NavParams, Slides} from 'ionic-angular';
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import {HttpClient} from "@angular/common/http";
import {Storage} from "@ionic/storage";
import {Observable} from 'rxjs/Observable';
import {LoginPage} from "../login/login";
import {BuyTicketPage} from "../buy-ticket/buy-ticket";


@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {
  @ViewChild('loopSlider') sliderComponent: Slides;

  public items:any;
  public pictures:any;
  responseData : any;
  errorDetails : any;
  eventName: any;
  eventDate: any;
  eventTime: any;
  standardPrice: any;
  vipPrice : any;
  eventDesc : any;
  eventAddress : any;
  ticketsLeft : any;
  standardTickets :any;
  vipTickets : any;
  eventId : any;
  lat  : any;
  lng : any;

  selectedSegment: any;
  showAll : any;
  all : any;
  showRead : any;
  showUnread : any;
  userPostData = {"user_id":"","token":""};
  userDetails : any;
  apiData  = {"id" : ""};

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService : AuthServiceProvider, public loadingCtrl : LoadingController, public alertCtrl : AlertController,
              public http : HttpClient, public modalCtrl : ModalController, public storage : Storage) {
    this.apiData.id = navParams.get('item');
  }

  ionViewDidLoad() {
    this.getData();
    this.getImages();
  }

  getData(){
    let loading = this.loadingCtrl.create({
      content: 'Loading...'
    });

    loading.present();

    this.authService.postData(this.apiData,'event')
        .then((result) => {
          this.responseData = result;

          if(this.responseData.eventData){
            loading.dismiss();

            this.items = this.responseData.eventData;
            this.eventName = this.items.btx_name;
            let date = new Date(this.items.btx_date);
            this.eventDate = this.dateConvert(date, "YYYY-MMM-DD DDD");
            this.eventTime = this.items.btx_time;
            this.standardPrice = this.items.btx_standard_price;
            this.vipPrice = this.items.btx_vip_price;
            this.eventDesc = this.items.btx_desc;
            this.eventAddress = this.items.btx_address;
            this.eventId = this.items.btx_event_id;
            this.standardTickets = parseInt(this.items.btx_standard_tickets);
            this.vipTickets = parseInt(this.items.btx_vip_tickets);
            this.ticketsLeft = this.standardTickets + this.vipTickets;
            this.lat = this.items.btx_lat;
            this.lng = this.items.btx_lng;
          }
          else{
            loading.dismiss();
            this.errorDetails = this.responseData.error;
            this.presentConfirm(this.errorDetails.text)

          }
        }, () => {
          loading.dismiss();
          this.presentConfirm("No or slow internet connection");

        });
  }

  getImages(){
    let url = 'https://koliko.io/apps/sticket/get-single-event-image.php?id='+this.apiData.id;
    //let url = 'https://pesewawebsoft.com/apps/sticket/get-single-event-image.php?id='+this.apiData.id;
    let data:Observable<any> = this.http.get(url);
    data.subscribe(results => {
      this.pictures = results;
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

  dateConvert(dateobj,format){
    var year = dateobj.getFullYear();
    var month= ("0" + (dateobj.getMonth()+1)).slice(-2);
    var date = ("0" + dateobj.getDate()).slice(-2);

    var day = dateobj.getDay();
    var months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    var dates = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
    var converted_date = "";

    switch(format){
      case "YYYY-MM-DD":
        converted_date = date + " " + month + " " + year;
        break;
      case "YYYY-MMM-DD DDD":
        converted_date = dates[parseInt(day)]+" "+date+" "+months[parseInt(month)-1]+" "+year
        break;
    }

    return converted_date;
  }

  goToNext() {
    this.sliderComponent.slideTo(1, 500);
  }

  goToPrevious() {
    this.sliderComponent.slideTo(0, 500);
  }

  openModal(){
    this.storage.get('sTUserData').then((data) =>{
      if(data){
        this.userDetails = data.userData;

        this.userPostData.user_id = this.userDetails.user_id;
        this.userPostData.token = this.userDetails.token;

        var modalPage = this.modalCtrl.create(BuyTicketPage,{eventId: this.eventId, eventName : this.eventName, standardPrice : this.standardPrice, vipPrice : this.vipPrice, standardTicket: this.standardTickets, vipTicket : this.vipTickets, userId: this.userPostData.user_id, token:this.userPostData.token,
          eventDate : this.eventDate});
        modalPage.present();
      }
      else{
        this.navCtrl.push(LoginPage)
      }
    })
  }
}
