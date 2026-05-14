import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiSearchQuery(): MethodDecorator {
  return applyDecorators(
    ApiQuery({ name: 'pageNo', required: false, type: Number, example: 1 }),
    ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 }),
    ApiQuery({ name: 'query', required: false, type: String }),
  );
}
