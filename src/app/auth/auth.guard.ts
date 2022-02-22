import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { DatabaseService } from '../database.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private db: DatabaseService, private router: Router) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const url: string = state.url;

    const isLoggedIn = await this.db.isLoggedIn();
    if (isLoggedIn) {
      return true;
    }

    this.db.setPostLoginRedirect(url);

    return this.router.parseUrl('/login');
  }
}
