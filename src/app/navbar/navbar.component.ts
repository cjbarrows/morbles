import { Input, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(private db: DatabaseService, private router: Router) {}

  cachedLoginStatus() {
    return this.db.cachedIsLoggedIn;
  }

  onLoginScreen() {
    return this.router.url === '/login';
  }

  ngOnInit(): void {}

  async logout(event: any) {
    event.preventDefault();
    await this.db.logout();
    console.log('SHOULD BE logged out');
  }
}
