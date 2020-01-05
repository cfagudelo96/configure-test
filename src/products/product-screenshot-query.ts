import { IsIn, IsOptional } from 'class-validator';

interface PuppeteerViewport {
  width: number;
  height: number;
}

export class ProductScreenshotQuery {
  @IsIn(['800x600', '1280x720', '1600x900', '1920x1080'])
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
