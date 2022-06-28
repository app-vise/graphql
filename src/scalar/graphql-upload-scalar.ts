import { Scalar, CustomScalar } from '@nestjs/graphql';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const GraphQLUpload = require('graphql-upload/GraphQLUpload.js');

@Scalar('Upload')
export class GraphQLUploadScalar implements CustomScalar<any, any> {
  description = 'The `Upload` scalar type represents a file upload.';

  public parseValue(value: any) {
    return GraphQLUpload.parseValue(value);
  }

  public serialize(value: any) {
    return GraphQLUpload.serialize(value);
  }

  public parseLiteral(ast: any) {
    return GraphQLUpload.parseLiteral(ast, ast.value);
  }
}
