import { Controller, Get, Res, Query } from '@nestjs/common';
import { Response } from 'express';

import { ProductsService } from './products.service';
import { ProductScreenshotQuery } from './product-screenshot-query';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/screenshot')
  async getProductScreenshot(@Query() query: ProductScreenshotQuery, @Res() res: Response) {
    const buffer = await this.productsService.getProductScreenshot(query);
    res.setHeader('Content-Transfer-Encoding', 'binary');
    res.setHeader('Content-Type', 'image/png');
    res.send(buffer);
  }
}
