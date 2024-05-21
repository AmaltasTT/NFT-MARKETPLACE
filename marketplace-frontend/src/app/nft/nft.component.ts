import { Component } from '@angular/core';
import { ContractService } from '../products/contract.service';
import { ProductService } from '../products/products.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NftService } from './nft.service';
import { errors } from 'web3';
import { AuthServices } from '../auth/auth.service';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nft.component.html',
  styleUrl: './nft.component.css'
})
export class NftComponent {
  file: File | null = null;
  collections: any[] = [];
  name: any
  description: any
  selectedCollection: { id: string, address: string } = { id: '', address: '' };

  constructor(private contractService: ContractService, private nftService: NftService, private authService: AuthServices) { }

  onSelectFile(event: any) {
    this.file = event.target.files[0];
  }

  async uploadFile() {
    if (!this.file) {
      console.error("NO file selected!!");
      return
    }
    if (localStorage.getItem("ethereum_account")) {
      (await this.nftService.uploadNFT(this.file, this.name, this.description, this.contractService.signer.address)).subscribe(
        async (response: any) => {
          const nftURI = response.metadataUrl
          const uri = await this.nftService.setNftURI(nftURI);
          const data = await this.nftService.createNft(nftURI)
          const res = await data.wait()
        },
        (error: any) => {
          alert(error.message)
        }
      )
    } else {
      alert("Connect your wallet!!")
    }
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.loadCollections()
    }
  }

  async loadCollections(): Promise<void> {
    const user = this.contractService.signer
    this.nftService.getCollectionsByUserAddress(user)
      .subscribe(collections => {
        this.collections = collections;
      });
  }

  // async onCollectionSelect(event: any): Promise<void> {
  //   // Update selected collection ID and reload collections
  //   if (event?.target?.value) {
  //     // Update selected collection ID and reload collections
  //     const [id, address] = event.target.value.split(',');
  //     this.selectedCollection = event.target.value;
  //     await this.nftService.setNftContractAddress(address)
  //     localStorage.setItem("nftAddress", address)
  //     this.loadCollections();
  //   }
  // }
}
