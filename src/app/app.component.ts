import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private isDarkTheme: boolean = false;

  @HostBinding('class')
  get themeMode(){
    return this.isDarkTheme ? 'dark-theme' : 'light-theme'
  }

  changeThemeMode(event){
    this.isDarkTheme = event.checked;
  }
}
