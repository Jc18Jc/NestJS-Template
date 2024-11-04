import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class CustomParseIntPipe implements PipeTransform<string, number> {
  constructor(private defaultValue: number) { }

  transform(value: string, metadata: ArgumentMetadata): number {
    if (!value) {
      return this.defaultValue;
    }

    const parsedValue = parseInt(value, 10);

    if (isNaN(parsedValue)) {
      throw new HttpException(`${metadata.data} must be a number`, HttpStatus.BAD_REQUEST);
    }

    return parsedValue;
  }
}
