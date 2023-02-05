import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  SerializeOptions,
} from '@nestjs/common';
import { OfferService } from './offer.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/role.decorator';
import { RoleEnum } from 'src/roles/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/roles/role.guard';

// @ApiBearerAuth()
// @Roles(RoleEnum.admin)
// @UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Offer')
@Controller({
  path: 'offer',
  version: '1',
})
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('import')
  @HttpCode(HttpStatus.OK)
  import(@Body('providerName') providerName: string) {
    return this.offerService.import(providerName);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createOfferDto: CreateOfferDto) {
    return this.offerService.create(createOfferDto);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.offerService.findAll();
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.offerService.findOne({ id: +id });
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: number, @Body() updateOfferDto: UpdateOfferDto) {
    return this.offerService.update(id, updateOfferDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: number) {
    return this.offerService.softDelete(id);
  }
}
