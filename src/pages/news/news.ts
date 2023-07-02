import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NewsDetailPage } from '../news-detail/news-detail';

@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  onClick(news){
      this.navCtrl.push(NewsDetailPage, {news: news})
  }

}
