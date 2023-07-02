import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public sqlite: SQLite) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.createDatabase();
    });
  }

  createDatabase(){
    this.sqlite.create({
      name: 'sticket.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {

      db.executeSql('CREATE TABLE IF NOT EXISTS ticket(ticketid INTEGER(11) PRIMARY KEY, event_id INTEGER(11), type VARCHAR(200), quantity INTEGER(10), total FLOAT(20), date VARCHAR(120), eventName VARCHAR(200), affiliation VARCHAR(200), created_at DATETIME DEFAULT CURRENT_TIMESTAMP)', [])
          .then(() => console.log('ticket table created'))
          .catch(e => console.log("Error creating ticket table "+JSON.stringify(e)));

    })
    .catch(e => console.log("Error "+JSON.stringify(e)));

  }
}

