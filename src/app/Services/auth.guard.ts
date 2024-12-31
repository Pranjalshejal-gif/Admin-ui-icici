import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): any {
    const routePermissions = route?.data['permissions']?.split(',');
    let hasPermissions = false;
    const permissions = this.userService?.userPermissions?.map((f: any) => f.id).flat();
    if (!routePermissions) {
      hasPermissions = true;
    }
    for (let i: number = 0; i < routePermissions?.length; i++) {
      hasPermissions = permissions?.some((item: any) => item?.includes(routePermissions[i]))
      if (hasPermissions) {
        break;
      }
    }

    if (this.userService.userSessionData && hasPermissions) {
      return true;
    } else {
      console.log("Route Permission >> false :" + routePermissions);
      this.userService.logout();
    }
  }
}
