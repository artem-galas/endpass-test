import { User } from '../models/user';
import { environment } from '../../environments/environment';

export class UserLocalStorage {
  static getUser(): User {
    const currentUser: User = JSON.parse(localStorage.getItem(environment.localStorageUserKey));
    return new User(currentUser.id, currentUser.balance);
  }

  static setUser(user: User) {
    localStorage.setItem(environment.localStorageUserKey, JSON.stringify(user));
  }
}
