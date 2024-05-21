import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuctionService } from './auction.service';
import { ProductService } from '../products/products.service';
import { contractAddress } from '../../../env';
import { ActivatedRoute, Router } from '@angular/router';
import { ethers } from 'ethers';

@Component({
  selector: 'app-auction',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auction.component.html',
  styleUrl: './auction.component.css'
})
export class AuctionComponent implements OnInit {
  nftId: string = ''
  ethAmount: string = ''
  listedNFT: any;
  objectId: any;
  initialPrice: any;
  CurrentBidPrice: string = '';
  lastBidPrice: string = '';

  constructor(private auctionService: AuctionService, private productService: ProductService, private router: Router, private route: ActivatedRoute) { }
  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(params => {
      this.objectId = params['id']
      this.nftId = params['nftId'];
      // Use the NFT ID to fetch detailed information about the NFT
    });
    this.getListedNFT();
    await this.getAuctionData()
  }

  async getListedNFT() {
    this.productService.listedNft(contractAddress.nftContractAddress).subscribe(data => {
      this.listedNFT = data
    })
  }

  async placeBid() {
    const amt = ethers.parseEther(this.ethAmount)
    const tx = this.auctionService.placeBid(this.nftId, amt.toString())
  }

  async getAuctionData() {
    const data = await this.auctionService.getAuctionDetail(this.nftId)
    if(data[7] > Date.now() / 1000) {
      this.initialPrice = ethers.formatEther(data[3])
      this.lastBidPrice = ethers.formatEther(data[4])
      this.CurrentBidPrice = ethers.formatEther(data[5])
    } else {
      alert('Auction not stared or ended')
      this.router.navigate(['/'])
    }
  }
}
