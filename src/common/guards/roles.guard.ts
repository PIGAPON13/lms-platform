import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('کاربر یافت نشد');
    }

    // اگر Admin باشه، همه جا دسترسی داره
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    return true;
  }
}
