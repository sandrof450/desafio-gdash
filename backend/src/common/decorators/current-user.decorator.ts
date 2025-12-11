import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from 'src/common/interfaces/interface.requestWithUser';

export const CurrentUser = createParamDecorator(
  (data: unknown, executionContext: ExecutionContext) => {
    const request = executionContext
      .switchToHttp()
      .getRequest<RequestWithUser>();

    return request.user;
  },
);
