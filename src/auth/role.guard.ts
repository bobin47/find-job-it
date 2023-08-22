import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requireRoles) {
      return true;
    }

    console.log(requireRoles);
    const { user } = context.switchToHttp().getRequest();
    console.log(user)
    return requireRoles.some(roles => user.roles.split(",").includes(roles));
  }
}
