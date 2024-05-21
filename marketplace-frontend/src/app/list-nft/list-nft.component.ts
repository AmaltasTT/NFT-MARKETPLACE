import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from '../products/contract.service';
import { FormsModule } from '@angular/forms';
import { NftService } from '../nft/nft.service';
import { ListServices } from './list-nft.service';
import { ProfileComponent } from '../profile/profile.component';
import { ProfileServices } from '../profile/profile.service';
import { contractAddress } from '../../../env';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ListServices],
  templateUrl: './list-nft.component.html',
  styleUrl: '../profile/profile.component.css',
})
export class ListNftComponent {
  // nftAddress: string = '';
  nftId: string = '';
  price: string = '';
  expiryTime: string = '';
  listingType: string = '0';
  nfts: any[] = [];
  objectId: any;
  
  constructor(private profileService: ProfileServices, private listService: ListServices, private nftService: NftService, private router: Router,private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get the NFT ID from the route parameters
    this.route.params.subscribe(params => {
      this.objectId = params['id']
      this.nftId = params['nftId'];
      this.nfts = this.profileService.nfts      
      // Use the NFT ID to fetch detailed information about the NFT
    });
  }

  async listNft(objectId: any) {
    const approve = await this.nftService.approveNft(this.listService.marketContractAddress)
    try {
      await this.listService.listNFT(
        this.nftId,
        this.price,
        this.expiryTime,
        this.listingType
      );
      this.listService.setValue(this.objectId)
      await this.router.navigate([`profile`])
    } catch (error) {
      console.error('Error:', error);
    }
  }

}