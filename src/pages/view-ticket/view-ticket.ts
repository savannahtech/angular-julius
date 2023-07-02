import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-view-ticket',
  templateUrl: 'view-ticket.html',
})
export class ViewTicketPage {
  ticketData : any;
  public created_code= null;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.ticketData = this.navParams.get("ticket");

    this.created_code = JSON.stringify(this.ticketData);
  }

}
