import { IsIn, IsOptional } from 'class-validator';

import { ProductsService } from './products.service';

interface PuppeteerViewport {
  width: number;
  height: number;
}

export class ProductScreenshotQuery {
  @IsIn(ProductsService.VALID_SCREENSHOT_RESOLUTIONS)
  @IsOptional()
  resolution: string = '1280x720';

  toViewport(): PuppeteerViewport {
    const [width, height] = this.resolution.split('x').map(value => +value);

    return {
      width,
      height
    };
  }
}
