import { Injectable } from '@angular/core';
import { ProfileServices } from '../profile/profile.service';
import { NftdetailService } from '../nftdetail/nftdetail.service';
import { contractAddress } from '../../../env';
import { ProductService } from '../products/products.service';
import { ListServices } from '../list-nft/list-nft.service';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {
  listedNFT: any;

  constructor(private profileService: ProfileServices, private listService: ListServices) { }


  async placeBid(nftId: string, bidAmount: string) {
    const signer = await this.profileService.provider.getSigner();
    const connectSigner = await this.profileService.marketContract.connect(signer);
    const tx = await connectSigner.placeBid(nftId, bidAmount, {value: bidAmount})
    await tx.wait();
    return tx;
  }

  async getAuctionDetail(nftId: string) {
    const data = await this.listService.marketContract.nftAuction(contractAddress.nftContractAddress, nftId)
    return data
  }


}
