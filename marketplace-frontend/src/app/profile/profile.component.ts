import { Component } from '@angular/core';
import { NftService } from '../nft/nft.service';
import { ContractService } from '../products/contract.service';
import { ProfileServices } from './profile.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ethers } from 'ethers';
import { contractAddress } from '../../../env';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  nfts: any[] = [];
  isListed: boolean = false;

  constructor(private profileService: ProfileServices, private contractService: ContractService, private router: Router) {}

  ngOnInit() {
    this.fetchNfts();
  }

  async fetchNfts() {
    const provider = await new ethers.BrowserProvider(window.ethereum)
    const user = await provider.getSigner()
    await this.profileService.fetchUserNft(user.address).subscribe({
      next: async (response) => {
        this.nfts = (response as any).imageUrl;
        for(let i=0; i<this.nfts.length; i++){
          
          const isList = await this.profileService.marketContract.nftList(contractAddress.nftContractAddress, this.nfts[i].nftId)
          if(isList[4] > await Date.now() / 1000 ) {
            this.isListed = true;
          }
        }
        await this.profileService.setNft(this.nfts)

      },
      error: (error) => {
        console.error('Error fetching NFTs:', error);
      }
    })
  }

  async listNFT(objectId:any, nftId: any) {
    this.router.navigate([`list-nft/${objectId}/${nftId}`])
  }

  async nftDetail(objectId:any, nftId: any) {
    this.router.navigate([`nft-detail/${objectId}/${nftId}`])
  }
}
