import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class ResponseService {
  success<T = unknown>(data?: T, status: number = 200, message?: string) {
    return {
      status,
      success: true,
      data: data ?? null,
      message,
    } as { success: true; data: T | null };
  }
  successMessage(message: string, status = 200) {
    return {
      status,
      success: true,
      data: null,
      message,
    };
  }
  error(message: string, statuCode = 400) {
    throw new HttpException(
      {
        success: false,
        message,
      },
      statuCode,
    );
  }
}
