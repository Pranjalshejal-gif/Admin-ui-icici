import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class CrumbResolver implements Resolve<any> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const crumbs = [route.data['crumb']];

    let parent = route?.parent;
    while (parent?.data['crumb']) {
      crumbs.unshift(parent.data['crumb']);
      parent = parent.parent;
    }
    return crumbs;
  }
}
