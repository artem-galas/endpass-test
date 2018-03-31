import { Component } from '@angular/core';
import { User } from './models/user';
import { environment } from '../environments/environment';
import { UserLocalStorage } from './lib/user-local-storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  public user: User;
  constructor() {
    const currentUser = UserLocalStorage.getUser();
    if (currentUser) {
      this.user = currentUser;
    } else {
      this.user = new User();
      UserLocalStorage.setUser(this.user);
    }
  }

  public getFreeCredits() {
    this.user.getFreeCredits();
    UserLocalStorage.setUser(this.user);
  }
}
