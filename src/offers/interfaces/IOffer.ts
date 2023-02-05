import { OfferBoxSizeEnum } from '../enums/offer-box-size.enum';

export interface IOffer {
  name: string;
  slug: string;
  description: string;
  requirements: string;
  thumbnail: string;
  boxSize: OfferBoxSizeEnum;
  isDesktop?: number;
  isAndroid?: number;
  isIos?: number;
  offerUrlTemplate: string;
  providerName?: string;
  externalOfferId?: string;
}
