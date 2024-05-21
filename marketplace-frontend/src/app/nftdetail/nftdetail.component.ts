import { Component, OnInit } from '@angular/core';
import { NftdetailService } from './nftdetail.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { contractAddress } from '../../../env';
import { ProductService } from '../products/products.service';
import { ProfileServices } from '../profile/profile.service';
import { NftService } from '../nft/nft.service';

@Component({
  selector: 'app-nftdetail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nftdetail.component.html',
  styleUrl: './nftdetail.component.css'
})
export class NftdetailComponent implements OnInit {
  nfts: any;
  nftId: string = ''
  objectId: any;
  listedNft: any[] = []
  date: any = Date.now() / 1000
  isListed: boolean[] = [];
  auction: any;
  isTransferable: boolean = false;
  isOwner: boolean = false;
  constructor(private nftdetail: NftdetailService,private profileService: ProfileServices ,private router: Router, private route: ActivatedRoute, private productService: ProductService, private nftService: NftService) { }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(params => {
      this.objectId = params['id']
      this.nftId = params['nftId'];
      // this.nfts = this.nftdetail.getNFt()
      this.nftdetail.getNftById(this.objectId).subscribe(data => {
        this.nfts = data
      });
      this.getListedNft()
      // this.isNFTListed()`
      // Use the NFT ID to fetch detailed information about the NFT
    });
    this.checkOwner()
    this.checkAuction()
  }

  fetchNftDetail() {
    this.nftdetail.getNftById(this.objectId).subscribe(data => {
      this.nfts = data
    });
  }

  async listNFT() {
    this.router.navigate([`list-nft/${this.objectId}/${this.nftId}`])
  }

  getListedNft() {
    this.productService.listedNft(contractAddress.nftContractAddress).subscribe(data => {
      this.listedNft = data
      for (let i = 0; i < this.listedNft.length; i++) {
        this.isListed[i] = true
      }
    })
  }

  isNFTListed(): boolean {
    for(let nft of this.listedNft) {
      if(nft.nftId == this.nftId && nft.expiryTime > this.date) {
        return true
      } else if(nft.nftId == this.nftId && nft.expiryTime < this.date && nft.listingType == 1) {
        this.isTransferable = true
      }
    }
    return false
  }

  async cancelListing() {
    const tx = (await this.nftdetail.cancelListedNFT(this.nftId))
    if (tx) {
      const deleteItem = await this.profileService.deleteListedItem(this.objectId).subscribe(response => {
          // this.router.navigate(['profile'])
          return { "success": true }
        })
    }
  }

  async cancelAuction() {
    const tx = (await this.nftdetail.cancelAuctionNFT(this.nftId))
    if (tx) {
      const deleteItem = await this.profileService.deleteListedItem(this.objectId).subscribe(response => {
          // this.router.navigate(['profile'])
          return { "success": true }
        })
    }
  }

  async checkAuction() {
    this.auction = await this.nftdetail.checkAuction(this.nftId)
  }

  checkIsListed() {
    return this.listedNft.some(nft => nft.nftId === this.nftId)
  }

  async transfer() {
    const tx = (await this.nftdetail.transferNFT(this.nftId)).subscribe(data => {
      if(!tx) {
      console.error("Failed to transfer nft!!!");  
      }
    })
  }

  async checkOwner() {
    const signer = await this.nftService.provider.getSigner()
    const owner = await this.nftService.nftContract.ownerOf(this.nftId)
    if(owner == signer.address) {
      this.isOwner = true
    }
  }
}
