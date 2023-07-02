import { Component } from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Storage} from "@ionic/storage";
import {HomePage} from '../home/home';
import {SignupPage} from "../signup/signup";
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  formGroup : FormGroup;
  submitAttempt: boolean = false;
  responseData : any;
  userPostData = {"text":""};
  errorDetails : any;
  public page;
  userData = {"user_id" : "", "token" : ""};
  verifyData : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public formBuilder: FormBuilder,
              public alertCtrl: AlertController, public loadingCtrl: LoadingController,public authService: AuthServiceProvider) {
    this.formGroup = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.maxLength(25),
        Validators.minLength(5),
        Validators.required
      ])),

      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ]))

    })
  }

  validation_messages = {
    'username': [
      { type: 'required', message: 'Username is required.' },
      { type: 'minlength', message: 'Username must be at least 5 characters long.' },
      { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your username must contain only numbers, letters and special characters.' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],

    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be more than 6 characters long.' }
    ]
  };

  skipSignIn(){
    this.navCtrl.setRoot(HomePage);
    this.storage.set('sTSkippedSignIn',true);
  }

  goToSignup(){
    this.navCtrl.push(SignupPage);
  }
  submitLogin(){
    this.userPostData.text = "";
    let loading = this.loadingCtrl.create({
      content: 'Logging in...'
    });

    loading.present();
    if(this.formGroup.valid){
      this.submitAttempt = false;
      this.authService.postData(this.formGroup.value,'login')
          .then((result) => {
            this.responseData = result;
            if(this.responseData.userData){
              loading.dismiss();
              this.storage.set('sTUserData', this.responseData);
              this.navCtrl.setRoot(HomePage);

            }
            else{
              loading.dismiss();
              this.storage.set('sTError', this.responseData);
              setTimeout(() => this.storage.get('sTError').then(data=> {
                if (data) {


                  this.errorDetails = data.error;

                  this.userPostData.text = this.errorDetails.text;
                }
                else {
                  this.navCtrl.push(LoginPage);
                }
              }), 1000);
            }
          }, (err) => {
            loading.dismiss();
            this.presentConfirm("No or slow internet connection")
          });
    }
    else{
      loading.dismiss();
      this.submitAttempt = true;
    }
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

  resetPassword(){}
}
