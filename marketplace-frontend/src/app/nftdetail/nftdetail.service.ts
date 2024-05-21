import { Injectable } from '@angular/core';
import { ProfileServices } from '../profile/profile.service';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../products/products.service';
import { contractAddress } from '../../../env';
import { ContractService } from '../products/contract.service';
import { NftService } from '../nft/nft.service';
import { sign } from 'web3/lib/commonjs/eth.exports';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NftdetailService {
  listedNFT: any;

  constructor(private profileService: ProfileServices, private http: HttpClient, private productService: ProductService, private nftService: NftService, private router: Router) { }
  private baseUrl = 'http://localhost:3000/nft'; // Your NestJS backend URL

  getNFt() {
    const nfts = this.profileService.nfts
    return nfts
  }

  getNftById(_id: string) {
    return this.http.get<any>(`${this.baseUrl}/detail/${_id}`)
  }


  getListedNFt() {
    this.productService.listedNft(contractAddress.nftContractAddress).subscribe(data => {
      this.listedNFT = data
    })
  }

  async checkAuction(nftId: string) {
    const auction = await this.profileService.marketContract.getAuctionItems(nftId)
    const initialPrice = auction[3]
    const currentBidPrice = auction[5];
    const winenr = auction[6];
    const expiryTime = auction[7];
    if (currentBidPrice > initialPrice) {
      return true;
    } else {
      return false
    }
  }

  async cancelListedNFT(nftId: string) {
    const signer = await this.profileService.provider.getSigner()
    const connectSigner = await this.profileService.marketContract.connect(signer);
    const checkOwner = await this.nftService.nftContract.ownerOf(nftId);
    if (checkOwner == signer.address) {
      const data = await connectSigner.cancelListing(nftId)
      await data.wait()
    } else {
      alert("Not owner")
    }
    return true
  }

  async cancelAuctionNFT(nftId: string) {
    const signer = await this.profileService.provider.getSigner()
    const connectSigner = await this.profileService.marketContract.connect(signer);
    const checkOwner = await this.nftService.nftContract.ownerOf(nftId);
    if (checkOwner == signer.address) {
      const data = await connectSigner.cancelAuction(nftId)
      await data.wait()
    } else {
      alert("Not owner")
    }
    return true
  }

  async transferNFT(nftId: string) {
    const signer = await this.profileService.provider.getSigner();
    const connectSigner = await this.profileService.marketContract.connect(signer);
    const checkOwner = await this.nftService.nftContract.ownerOf(nftId);
    if (checkOwner == signer.address) {
      const tx = await connectSigner.transferAuctionNft(nftId)
      if (tx) {
        const getAuctionDetial = await this.profileService.marketContract.nftAuction(contractAddress.nftContractAddress, nftId)
        const auctionWinner = getAuctionDetial[6]
        await this.profileService.updateNftOwner(nftId, auctionWinner).subscribe(data => {
        console.log('data :', data);
        })
      }
      await tx.wait()
      this.router.navigate(['profile'])
    } else {
      alert("Not nft owner")
    }
    return this.http.delete<any>(`${this.baseUrl}/delete/${nftId}`);
  }

}
