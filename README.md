# HttpKit

A Node.js package for managing HTTP client requests

## Utilities

### `plainToDto`

This method converts a plain object to a DTO object using the provided DTO class. If the DTO class is not provided, it return the plain object as is:

```ts
import { Type } from 'class-transformer';
import { plainToDto } from './plain-to-dto';

class Dto {
  id: number;
  name: string;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;

  @Type(() => Hit)
  hits: Hit[];
}

const dto = plainToDto(plain, Dto);
```
