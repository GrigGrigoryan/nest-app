import { PartialType } from '@nestjs/swagger';
import { CreateOfferDto } from './create-offer.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  Validate,
} from 'class-validator';
import { IsNotExist } from '../../utils/validators/is-not-exists.validator';
import { OfferBoxSizeEnum } from '../enums/offer-box-size.enum';
import { Offer } from '../entities/offer.entity';

export class UpdateOfferDto extends PartialType(CreateOfferDto) {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Validate(IsNotExist, ['Offer'], {
    message: 'offerAlreadyExists',
  })
  @MaxLength(255)
  slug: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  requirements: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  thumbnail: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(OfferBoxSizeEnum)
  boxSize: OfferBoxSizeEnum;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1)
  isDesktop?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1)
  isAndroid?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1)
  isIos?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(256)
  offerUrlTemplate: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  providerName?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  externalOfferId?: string;
}
