import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { Connection, InsertResult, ObjectLiteral, Repository } from "typeorm";
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';
import * as constants from './constants';
import { v4 as uuidv4 } from 'uuid';
import { OfferBoxSizeEnum } from './enums/offer-box-size.enum';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private connection: Connection,
  ) {}

  async create(createOfferDto: CreateOfferDto) {
    return await this.offerRepository.save(
      await this.offerRepository.create(createOfferDto),
    );
  }

  async import(providerName: string) {
    const existingOffer: Offer = await this.offerRepository.findOne({
      where: { providerName },
    });
    if (existingOffer) {
      throw new BadRequestException('Offer already exists');
    }
    let offerPayload = constants[providerName];
    if (!offerPayload) {
      throw new NotFoundException('Offer payload not found');
    }
    let mappedOfferPayload: CreateOfferDto[] = [];

    switch (providerName) {
      case 'offer1':
        // need further documentation about other available fields related to device fields
        mappedOfferPayload = offerPayload?.response?.offers?.map(
          (offer: any): CreateOfferDto => {
            return {
              boxSize: OfferBoxSizeEnum.LARGE,
              slug: uuidv4(),
              externalOfferId: offer.offer_id,
              name: offer.offer_name,
              description: offer.offer_desc,
              requirements: offer.call_to_action,
              offerUrlTemplate: offer.offer_url,
              thumbnail: offer.image_url,
              isDesktop: offer.platform === 'desktop' ? 1 : 0,
              isIos:
                offer.platform === 'mobile' && offer.device === 'iphone_ipad'
                  ? 1
                  : 0,
              isAndroid:
                offer.platform === 'mobile' && offer.device.includes('android')
                  ? 1
                  : 0,
            };
          },
        );
        break;
      case 'offer2':
        mappedOfferPayload = Object.values(offerPayload?.data)?.map(
          (el: any): CreateOfferDto => {
            let offer = el?.Offer;
            let os = el?.OS;

            return {
              boxSize: OfferBoxSizeEnum.SMALL,
              slug: uuidv4(),
              externalOfferId: offer.campaign_id,
              name: offer.name,
              description: offer.description,
              requirements: offer.instructions,
              offerUrlTemplate: offer.tracking_url,
              thumbnail: offer.icon,
              isDesktop: Number(os.web),
              isIos: Number(os.ios),
              isAndroid: Number(os.android),
            };
          },
        );

        break;
    }

    return await this.bulkCreate(mappedOfferPayload);
  }

  async bulkCreate(offers: CreateOfferDto[]): Promise<ObjectLiteral[]> {
    //decided to wrap into transaction
    //typeorm Connection is deprecated need some research
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await queryRunner.manager
        .getRepository(Offer)
        .insert(offers);

      await queryRunner.commitTransaction();
      return result.identifiers;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.offerRepository.find();
  }

  async findOne(where: EntityCondition<Offer>) {
    return this.offerRepository.findOne({
      where,
    });
  }

  async update(id: number, updateOfferDto: UpdateOfferDto) {
    const existingOffer = await this.offerRepository.findOne({
      where: { id },
    });
    if (!existingOffer) {
      throw new NotFoundException('Offer not found');
    }

    Object.assign(existingOffer, updateOfferDto);
    return await this.offerRepository.save(existingOffer);
  }

  async softDelete(id: number): Promise<void> {
    await this.offerRepository.softDelete(id);
  }
}
