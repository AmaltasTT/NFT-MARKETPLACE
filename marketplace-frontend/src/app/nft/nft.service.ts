import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { ContractService } from '../products/contract.service';
import { ethers } from 'ethers';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { local } from 'web3modal';
import { contractAddress } from '../../../env';
import { NftAbi } from '../contact-abi/nft.abi';


@Injectable({
  providedIn: 'root'
})
export class NftService {
  nftContract: any;
  signer: any;
  provider: any;
  contractAddress: any
  walletAddress: string | null = null;
  userBalance: number | null = null;
  isWalletConnected: boolean = false;
  nftURI: string = ''

  nftMetadata: string | null = null;
  private baseUrl = 'http://localhost:3000/nft/upload'; // Your NestJS backend URL

  constructor(private http: HttpClient, private contractService: ContractService, private router: Router) {
    this.provider = this.contractService.provider
    const abi = NftAbi;
    this.contractAddress = contractAddress.nftContractAddress//"0x7bf1eEA2c602300b44Ff8Dac69F06639F5DBa135"
    localStorage.setItem("nftAddress", this.contractAddress)
    this.nftContract = new ethers.Contract(this.contractAddress, abi, this.provider)
    localStorage.setItem("nftContract", JSON.stringify(this.nftContract))
  }

  async uploadNFT(file: File, imageName: string, description: string, nftOwner: string) {
    let owner = await this.provider.getSigner();
    nftOwner = await owner.address
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', imageName);
    formData.append('description', description);
    formData.append('nftOwner', nftOwner);
    const headers = new HttpHeaders();
    headers.append('Content-type', 'multipart/form-data');
    return this.http.post(this.baseUrl, formData, { headers })
  }

  async updateAddress(nftContractAddres: string) {
    const headers = new HttpHeaders();
    return this.http.post("http://localhost:3000/nft/update-address", nftContractAddres, {headers})
  }

  async createNft(nftURI: string) {
    if (await this.contractService.isWalletConnected) {
      const user = await this.provider.getSigner()
      const Signer = await this.nftContract.connect(user);
      const data = await Signer.safeMint(nftURI);
      const tx = await data.wait()
      const receipt = await this.provider.getTransactionReceipt(tx.hash);
      const tokenId = parseInt(receipt.logs[0].topics[3]);
      if (data) {
        this.router.navigate(['profile'])
      }
      return data;
    } else {
      alert("Connect your wallet")
    }
  }

  async setNftURI(nftUri: string) {
    this.nftURI = nftUri
    return this.nftURI
  } 

  async approveNft(marketplaceAddress: string) {
    const signer = await this.provider.getSigner()
    const nftContract = localStorage.getItem("nftContract")
    const Signer = await this.nftContract.connect(signer)
    const isApproved = await this.nftContract.isApprovedForAll(signer, marketplaceAddress)
    if (!isApproved) {
      const approve = await Signer.setApprovalForAll(marketplaceAddress, true)
      const res = await approve.wait()
    }
  }
  private apiUrl = 'http://localhost:3000/nft-collection';

  getCollectionsByUserAddress(userAddress: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userAddress}`);
  }

  findByUserAddressAndId(userAddress: string, collectionId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userAddress}/${collectionId}`)
  }
}