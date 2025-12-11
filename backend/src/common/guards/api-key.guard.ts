import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const apiKey: string = request.headers['x-api-key'] as string;

    if (!apiKey || apiKey !== process.env.WORKER_API_KEY)
      throw new HttpException('Invalid Api key', HttpStatus.UNAUTHORIZED);

    return true;
  }
}
