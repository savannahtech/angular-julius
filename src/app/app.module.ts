import { CartPage } from './../pages/cart/cart';
import { NewsPage } from './../pages/news/news';
import { ViewTicketPage } from './../pages/view-ticket/view-ticket';
import { TicketsPage } from './../pages/tickets/tickets';
import { QrcodePage } from './../pages/qrcode/qrcode';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {LoginPage} from "../pages/login/login";
import {IonicStorageModule} from "@ionic/storage";
import {HttpClientModule} from "@angular/common/http";
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import {SignupPage} from "../pages/signup/signup";
import {HttpModule} from "@angular/http";
import {EventPage} from "../pages/event/event";
import {BuyTicketPage} from "../pages/buy-ticket/buy-ticket";
import {PaymentPage} from "../pages/payment/payment";
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { PopoverPage } from '../pages/popover/popover';
import { NewsDetailPage } from '../pages/news-detail/news-detail';
import {SQLite} from "@ionic-native/sqlite";
import {InAppBrowser} from '@ionic-native/in-app-browser';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
      LoginPage,
      SignupPage,
      EventPage,
      BuyTicketPage,
      PaymentPage,
      QrcodePage,
      PopoverPage,
      TicketsPage,
      ViewTicketPage,
      NewsPage,
      NewsDetailPage,
      CartPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
      IonicStorageModule.forRoot(),
      HttpClientModule,
      HttpModule, 
      NgxQRCodeModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
      LoginPage,
      SignupPage,
      EventPage,
      BuyTicketPage,
      PaymentPage,
      QrcodePage,
      PopoverPage,
      TicketsPage,
      ViewTicketPage,
      NewsPage,
      NewsDetailPage,
      CartPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    SQLite, 
    InAppBrowser
  ]
})
export class AppModule {}
