import { Component, OnInit } from '@angular/core';
import { DealService } from './deal.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileServices } from '../profile/profile.service';

@Component({
  selector: 'app-deal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './deal.component.html',
  styleUrl: './deal.component.css'
})
export class DealComponent implements OnInit{
  nftIdTo: string = ''
  nftIdFrom: string = ''
  addressTo: string = ''
  
  constructor(private dealService: DealService, private profileService: ProfileServices) {}
  
  async tradeNFT() {
    this.dealService.getPriceDiff(this.nftIdTo, this.nftIdFrom)
    const tx = this.dealService.tradeNFT(this.nftIdTo, this.addressTo, this.nftIdFrom)
    if (await tx) {
      await this.profileService.deleteListedItem(this.nftIdTo).subscribe(response => {
          return { "success": true }
        })
      await this.profileService.deleteListedItem(this.nftIdFrom).subscribe(response => {
          return { "success": true }
        })
    }
    return tx
  }

  async ngOnInit(): Promise<void> {
  }
}
