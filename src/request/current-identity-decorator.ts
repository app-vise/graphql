import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetCurrentIdentity = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.currentIdentity as CurrentIdentity;
  }
);

export interface CurrentIdentity {
  id: string;
  accountId?: string;
  [key: string]: any;
}
