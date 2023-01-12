import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Account } from './account.type';

export const GetCurrentIdentity = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.currentIdentity as CurrentIdentity;
  }
);

export interface CurrentIdentity {
  id: string;
  account: Account;
  [key: string]: any;
}
