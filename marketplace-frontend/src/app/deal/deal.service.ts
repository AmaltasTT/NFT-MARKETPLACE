import { Injectable } from '@angular/core';
import { ProfileServices } from '../profile/profile.service';
import { NftService } from '../nft/nft.service';
import { ContractService } from '../products/contract.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DealService {

  constructor(private profileService: ProfileServices, private nftService: NftService,
              private contractService: ContractService, private router: Router) { }

  async checkUserBal() {
    const user = await this.profileService.provider.getSigner();
    const bal = this.profileService.erc20TokenContract.balanceOf(user.address)
  }

  async checkNftOwner(nftId: string) {
    const isOwner = await this.nftService.nftContract.ownerOf(nftId)
    return isOwner;
  }

  async tradeNFT(nftIdTo: string, addressTo: string, nftIdFrom: string):Promise<any> {
    const signer = await this.profileService.provider.getSigner()
    const connectSigner = await this.profileService.marketContract.connect(signer);
    try {
      if(this.contractService.isWalletConnected) {
        const tx = await connectSigner.tradeNftForNft(nftIdTo, addressTo, nftIdFrom, {value: this.getPriceDiff(nftIdTo, nftIdFrom)})
        await tx.wait()
        if(tx) {
          await this.profileService.updateNftOwner(nftIdFrom, signer.address).subscribe(response => {
          })
          await this.profileService.updateNftOwner(nftIdTo, addressTo).subscribe(response => {
          })
          this.router.navigate(['/profile'])
          return { "success": true }
        }
      } else {
        alert("Connect your wallet!!!")
      }
    } catch (error) {
      alert(error)
    }
  }

  async getPriceDiff(nftIdTo: string, nftIdFrom: string) {
    const signer = await this.profileService.provider.getSigner()
    const diff = await this.profileService.marketContract.getListPriceDiff(nftIdTo, nftIdFrom)
    console.log('diff :', diff);
    return diff
  }
  
}
