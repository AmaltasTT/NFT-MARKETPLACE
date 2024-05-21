import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileServices } from './profile.service';
import { NftService } from '../nft/nft.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from '../products/contract.service';
import { ListServices } from '../list-nft/list-nft.service';
import { local } from 'web3modal';
import { ethers } from 'ethers';
import { TokenswapService } from '../tokenswap/tokenswap.service';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buynft.component.html',
  styleUrl: './profile.component.css',
  providers: [ProfileServices]
})

export class BuyComponent implements OnInit {
  buyTypeOptions = [{ name: 'ETH', value: 1 }, { name: 'Token', value: 0 }];
  selectedBuyType: string = '';
  nftAddress: string = '';
  nftId: string = '';
  ethAmount: string = '';
  price: string = ''
  objectId: any;
  tokenBalance: string = '';
  ethBalance: string = ''

  constructor(private profileService: ProfileServices, private nftService: NftService, private tokenService: TokenswapService,
    private router: Router, private route: ActivatedRoute, private contractService: ContractService, private listService: ListServices
  ) {
    this.objectId = this.route.snapshot.params['id']
    this.profileService.setObjectId(this.objectId)
    this.nftId = this.route.snapshot.params['nftId'];
  }

  async ngOnInit(): Promise<void> {
    await this.getTokenbalance()
  }

  async buyNft(): Promise<any> {
    try {
      if (this.selectedBuyType === "0") {
        const userBal = await this.profileService.checkTokenBalance()
        const tx = await this.profileService.buyNft(this.nftId, '0', this.selectedBuyType)
        if (tx) {
          const provider = new ethers.BrowserProvider(window.ethereum)
          const user = await provider.getSigner()
          const deleteItem = await this.profileService.deleteListedItem(this.nftId).subscribe(response => {
            return { "success": true }
          })
          const updateowner = await this.profileService.updateNftOwner(this.nftId, user.address).subscribe(response => {
            this.router.navigate(['/profile'])
            return { "success": true }
          })
        }
      } else {
        const tx = await this.profileService.buyNft(this.nftId, this.ethAmount, this.selectedBuyType)
        if (tx) {
          const provider = new ethers.BrowserProvider(window.ethereum)
          const user = await provider.getSigner()
          const deleteItem = await this.profileService.deleteListedItem(this.nftId).subscribe(response => {
            return { "success": true }
          })
          const updateowner = await this.profileService.updateNftOwner(this.nftId, user.address).subscribe(response => {
            this.router.navigate(['/profile'])
            return { "success": true }
          })
        }
      }
      const nftAddress = await localStorage.getItem("nftAddress")
    } catch (error) {
      console.error('Error:', error);
    }
  }

  onBuyType(event: any): void {
    if (event?.target?.value) {
      this.selectedBuyType = event.target.value;
      if (this.selectedBuyType === "0") {

      }
    }
  }

  async getTokenbalance() {
    const user = await this.tokenService.provider.getSigner()
    const bal = await this.tokenService.erc20Contract.balanceOf(user.address)
    this.tokenBalance = ethers.formatEther(bal)
    const ethBal = await this.tokenService.provider.getBalance(user.address)
    const balInEth = ethers.formatEther(ethBal)
    this.ethBalance = Number(balInEth).toFixed(4)
  }
}