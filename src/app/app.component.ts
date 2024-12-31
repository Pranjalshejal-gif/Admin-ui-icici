import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import config from '../assets/config.json';
import { ConfigData } from './models/config_data';
import { UserService } from './Services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  Layouts = Layouts;
  layout = '';
  configData: ConfigData = config;

  constructor(private router: Router, private ref: ChangeDetectorRef, public userService: UserService) {
    document.documentElement.style.setProperty('--primary-color', this.configData.primary_theme_color);
    document.documentElement.style.setProperty('--primary-btn-color', this.configData.primary_button_color);
    document.documentElement.style.setProperty('--primary-btn-text-color', this.configData.primary_button_text_color);
    document.documentElement.style.setProperty('--secondry-btn-color', this.configData.secondry_button_color);
    document.documentElement.style.setProperty('--secondry-btn-text-color', this.configData.secondry_button_text_color);
    document.documentElement.style.setProperty('--nav_btn_color', this.configData.nav_btn_color);
    document.documentElement.style.setProperty('--nav_btn_text_color', this.configData.nav_btn_text_color);
    document.documentElement.style.setProperty('--nav_btn_padding_color', this.configData.nav_btn_padding_color);
    document.documentElement.style.setProperty('--nav_icon_text_color', this.configData.nav_icon_text_color);
    document.documentElement.style.setProperty('--nav_bg_color', this.configData.nav_bg_color);
    document.documentElement.style.setProperty('--nav_text_color', this.configData.nav_text_color);
    document.documentElement.style.setProperty('--nav_hover_color', this.configData.nav_hover_color);
    document.documentElement.style.setProperty('--nav_icon_text_color_active', this.configData.nav_icon_text_color_active);

  }
  ngOnInit(): void {
    this.router.events.subscribe((data) => {
      if (data instanceof RoutesRecognized) {
        if (data.state.root.firstChild) {
          if (this.layout !== data.state.root.firstChild.data['layout']) {
            this.layout = '';
            this.layout = data.state.root.firstChild.data['layout'];
          } else {
            this.layout = data.state.root.firstChild.data['layout'];
          }
        }
      }
      if ((this.router.url.indexOf('login') !== -1)) {

        this.layout = "0";

      }
      else if (this.router.url.indexOf('reset-password') !== -1) {
        this.layout = "2";
      }
      else if (this.router.url.indexOf('change-password') !== -1) {
        this.layout = "3";
      }
      else {
        this.layout = "1";
      }
    });
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
 
}
export enum Layouts {
  DEFAULT, SIDENAV, FORGOTPASSWORD, CHANGEPASSWORD
}