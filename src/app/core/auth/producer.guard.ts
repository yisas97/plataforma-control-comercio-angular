import { CanActivateFn } from '@angular/router';

export const producerGuard: CanActivateFn = (route, state) => {
  return true;
};
