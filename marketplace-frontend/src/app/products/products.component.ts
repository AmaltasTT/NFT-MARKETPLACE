import { Component } from '@angular/core';
import { ContractService } from './contract.service';
import Web3 from 'web3';
import { ProductService } from './products.service';
import { Product } from './products.model';
import { CommonModule } from '@angular/common';
import { create } from 'ipfs-http-client';
import { NftService } from '../nft/nft.service';
import { FormsModule } from '@angular/forms';
import { contractAddress } from '../../../env';
import { ethers } from 'ethers';
import { Router } from '@angular/router';
import { ProfileServices } from '../profile/profile.service';



@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  products: Product[] = []
  listedNfts: any;
  showListedNfts: any
  constructor(private web3Service: ContractService, private productService: ProductService, private nftService: NftService, private profileService: ProfileServices, private router: Router) { }

  async ngOnInit(): Promise<void> {
    await this.productService.getProducts().subscribe(data => {
      this.products = data
    })
    this.productService.listedNft(contractAddress.nftContractAddress).subscribe(async data => {
      for (let i = 0; i < data.length; i++) {
        const listedITem = await this.profileService.marketContract.getListedItems(data[i].nftId)
        if (listedITem[5] == false && listedITem[4] > Date.now() / 1000) {
          this.listedNfts = data
        }
      }
    })
  }

  async getTokenBalance() {
    const data = await this.web3Service.getTokenBalance();
  }

  async weiToEth(weiAmount: string) {
    await ethers.formatEther(weiAmount)
  }

  async connect() {
    const signer = await this.web3Service.connect();
    return signer;
  }

  async buyProduct(productId: number, productPrice: number) {
    const data = await this.web3Service.buyProduct(productId, productPrice)
    return data
  }

  async routeToBuy(objectId: string, nftId: string) {
    this.router.navigate([`buy-nft/${objectId}/${nftId}`])
  }

  
  async routeToAuction(objectId: string, nftId: string) {
    this.router.navigate([`auction/${objectId}/${nftId}`])
  }
  
  async nftDetail(objectId:any, nftId: any) {
    this.router.navigate([`nft-detail/${objectId}/${nftId}`])
  }
}

