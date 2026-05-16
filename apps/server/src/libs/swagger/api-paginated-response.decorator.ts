import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PageInfoDTO } from '../dtos/page-info.dto';

export function ApiPaginatedResponse<T>(model: Type<T>): MethodDecorator {
  return applyDecorators(
    ApiExtraModels(PageInfoDTO, model),
    ApiOkResponse({
      schema: {
        properties: {
          items: { type: 'array', items: { $ref: getSchemaPath(model) } },
          pageInfo: { $ref: getSchemaPath(PageInfoDTO) },
        },
        required: ['items', 'pageInfo'],
      },
    }),
  );
}
