import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/screenshot')
  async takeProductScreenshot(@Res() res: Response) {
    const buffer = await this.productsService.takeProductScreenshot();
    res.setHeader('Content-Transfer-Encoding', 'binary');
    res.setHeader('Content-Type', 'image/png');
    res.send(buffer);
  }
}
