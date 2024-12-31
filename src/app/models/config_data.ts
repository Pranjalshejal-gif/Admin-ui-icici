import { MatFormFieldAppearance } from "@angular/material/form-field";

export interface NavItem {
  displayName: string;
  disabled?: boolean;
  iconName: string;
  route: string;
  children?: NavItem[];
  selfRoute: boolean;
  permission: any;
}

export interface ConfigData {
  name: string;
  id: string;
  logoImg: string;
  flagImg: string;
  portalImg: string;
  primary_theme_color: string;
  primary_button_color: string;
  primary_button_text_color: string;
  secondry_button_color: string;
  secondry_button_text_color: string;
  nav_btn_color: string;
  nav_btn_text_color: string;
  nav_btn_padding_color: string;
  nav_icon_text_color: string;
  nav_bg_color: string;
  nav_text_color: string;
  nav_hover_color: string;
  sidemenu_item: NavItem[];
  customLoginPage: boolean;
  loginInputBox: MatFormFieldAppearance;
  loginBtnTxt: string;
  nav_icon_text_color_active: string;
  dayDiffForSearchCriteria: number;
}