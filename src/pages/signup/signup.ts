import { Component } from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PasswordValidator} from "../../../validators/password.validator";
import {LoginPage} from "../login/login";
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import {Storage} from "@ionic/storage";
import {HomePage} from "../home/home";


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  formGroup : FormGroup;
  submitAttempt: boolean = false;
  responseData : any;
  userPostData = {"text":""};
  errorDetails : any;
  userData = {"user_id" : "", "token" : ""};
  verifyData : any;
  page: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder,
              public alertCtrl: AlertController, public loadingCtrl: LoadingController, public authService:AuthServiceProvider,
              public storage:Storage) {
    this.formGroup = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.maxLength(25),
        Validators.minLength(5),
        Validators.required
      ])),

      fullname: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
        Validators.pattern('[a-zA-Z ]*')
      ])),

      email : new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),


      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),

      confirm_password: new FormControl('', Validators.compose([
        Validators.required,
        PasswordValidator.equalto('password')
      ])),

      gender: new FormControl('none'),

      phone: new FormControl(''),
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
    'fullname': [
      { type: 'required', message: 'Name is required.' },
      { type: 'minlength', message: 'Name must be at least 5 characters long.' },
      { type: 'pattern', message: 'Name must contain only letters.' }
    ],

    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],

    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be more than 6 characters long.' }
    ],

    'confirm_password': [
      { type: 'required', message: 'Retype your password.' },
      { type: 'equalTo', message: 'Passwords mismatch.' }
    ],

    'gender': [
      { type: 'required', message: 'Gender is required.' }
    ],

    'phone': [
      { type: 'required', message: 'Phone number is required.' },
      { type: 'minlength', message: 'Phone number must be at least 9.' }
    ],
  };

  goToLogin(){
    this.navCtrl.push(LoginPage);
  }

  submitSignUp(){
    let loading = this.loadingCtrl.create({
      content: 'Signing up...'
    });

    loading.present();
    if(this.formGroup.valid){
      this.submitAttempt = false;
      this.authService.postData(this.formGroup.value,'signup').then((result) => {
        this.responseData = result;
        if(this.responseData.userData){
          loading.dismiss();
          this.storage.set('sTUserData', this.responseData);
          this.navCtrl.setRoot(HomePage);

        }
        else {
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


}
