import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProfileComponent } from '../profile/profile.component';
import { ContractService } from '../products/contract.service';
import { Observable } from 'rxjs';
import { ethers } from 'ethers';
import { tokenABI } from './token.abi';
import { contractAddress } from '../../../env';
import { marketAbi } from '../contact-abi/nft-market.abi';

@Injectable({
    providedIn: 'root'
})

export class ListServices {
    marketContract: any;
    signer: any
    walletAddress: string = "";
    userBalance: number | null = null;
    isWalletConnected: boolean = false;
    marketContractAddress: any;
    erc20TokenContractAddress: any;
    erc20TokenContract: any
    nfts: any
    nftId: any

    private baseUrl = 'http://localhost:3000'; // Your NestJS backend URL
    provider: ethers.BrowserProvider;

    constructor(private http: HttpClient, private contractService: ContractService) {
        this.erc20TokenContractAddress = contractAddress.erc20TokenContractAddress
        this.marketContractAddress =  contractAddress.nftMarketContractAddress
        const marketplaceAbi = marketAbi
        const tokenAbi = tokenABI
        this.provider = new ethers.BrowserProvider(window.ethereum )
        this.walletAddress = this.contractService.walletAddress;
        this.marketContract = new ethers.Contract(this.marketContractAddress, marketplaceAbi, this.provider)
        this.erc20TokenContract = new ethers.Contract(this.erc20TokenContractAddress, tokenAbi, this.provider)
    }

    setValue(objectId: any) {
        this.nftId = objectId
    }

    getValue() {
        return this.nftId
    }

    async listNFT(nftId: string, price: string, expiryTime: string, listingType: string): Promise<Observable<any>> {
        const user = await this.provider.getSigner()
        try {
            const formData = {
                nftId,
                price,
                expiryTime,
                listingType
            }
            const connectSigner = await this.marketContract.connect(user)
            const priceInWei = await ethers.parseEther(price)
            const tx = await connectSigner.listNFT(
                nftId,
                priceInWei,
                Math.floor(new Date(expiryTime).getTime() / 1000), // Convert expiry time to UNIX timestamp
                listingType
            );
            await tx.wait()
            return this.http.post<any>(`${this.baseUrl}/nft/list-nft`, formData)
        } catch (error) {
            console.error('Error:', error);
            throw error; // Re-throw error for handling in the component
        }
    }
}