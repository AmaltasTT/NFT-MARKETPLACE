import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ContractService } from '../products/contract.service';
import { ethers } from 'ethers';
import { sign } from 'web3/lib/commonjs/eth.exports';
import { NftService } from '../nft/nft.service';
import { contractAddress } from '../../../env';
import { infinityAbi } from '../contact-abi/infinity-coin.abi';
import { marketAbi } from '../contact-abi/nft-market.abi';

interface ImageResponse {
    imageUrl: string;
}

@Injectable({
    providedIn: 'root'
})

export class ProfileServices {
    marketContract: any;
    signer: any
    walletAddress: string = "";
    userBalance: number | null = null;
    isWalletConnected: boolean = false;
    marketContractAddress: any;
    erc20TokenContractAddress: any;
    erc20TokenContract: any
    private baseUrl = 'http://localhost:3000'; // Your NestJS backend URL
    nfts: any[] = [];
    objectId: any
    provider: ethers.BrowserProvider;

    constructor(private http: HttpClient, private router: Router, private contractService: ContractService, private nftService: NftService) {
        this.erc20TokenContractAddress = contractAddress.erc20TokenContractAddress
        this.marketContractAddress = contractAddress.nftMarketContractAddress
        const marketplaceAbi = marketAbi;
        const tokenAbi = infinityAbi;
        this.provider = new ethers.BrowserProvider(window.ethereum)
        this.walletAddress = this.contractService.walletAddress;
        this.marketContract = new ethers.Contract(this.marketContractAddress, marketplaceAbi, this.provider)
        this.erc20TokenContract = new ethers.Contract(this.erc20TokenContractAddress, tokenAbi, this.provider)
    }

    fetchUserNft(nftOwner: string): Observable<string[]> {
        const url = `${this.baseUrl}/nft/${nftOwner}`;
        return this.http.get<string[]>(url);
    }

    updateNftOwner(nftId: string, nftOwner: string): Observable<any> {
        return this.http.put(`${this.baseUrl}/nft/${nftId}/owner`, { nftOwner });
    }

    async setObjectId(id: any) {
        this.objectId = id;
    }

    async buyNft(nftId: string, ethAmount: string, buyType: string): Promise<any> {
        try {
            const user = await this.provider.getSigner()
            const connectSigner = await this.marketContract.connect(user)
            const listedNFT = await this.marketContract.getListedItems(nftId)
            const ethValue = await ethers.parseEther(ethAmount); // Convert ETH amount to wei
            if (buyType == '1') {
                const ethBal = await this.provider.getBalance(user.address)
                if (ethBal > ethValue) {
                    const tx = await connectSigner.buyNft(nftId, buyType, { value: ethValue });
                    await tx.wait()
                    return await this.updateNftOwner(nftId, user.address)
                } else {
                    alert("Not enough balance")
                }

            } else {
                const tokenBalance = await this.erc20TokenContract.balanceOf(user.address)
                const calToken = await this.erc20TokenContract.calculateTokenAmountForEther(listedNFT[3])
                const allowance = await this.erc20TokenContract.allowance(user.address, contractAddress.nftMarketContractAddress)
                if (await tokenBalance > calToken) {
                    if (allowance < calToken) {
                        await this.approveTokens(contractAddress.nftMarketContractAddress, calToken)
                    }
                    const tx = await connectSigner.buyNft(nftId, buyType);
                    await tx.wait()
                    return await this.updateNftOwner(nftId, user.address) // update owner
                } else {
                    alert("Not enough token balance")
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    deleteListedItem(nftId: string) {
        return this.http.delete(`${this.baseUrl}/nft/delete/${nftId}/`);
    }

    async checkTokenBalance() {
        const user = await this.provider.getSigner();
        const balance = await this.erc20TokenContract.balanceOf(user.address)
        return balance;
    }

    async approveTokens(marketplaceAddress: string, tokenValue: string) {
        const user = await this.provider.getSigner()
        const signer = await this.erc20TokenContract.connect(user)
        const tokenInWei = Number(tokenValue) * 10 ** this.erc20TokenContract.decimals()
        const approve = await signer.approve(marketplaceAddress, tokenValue)
        await approve.wait()
        return approve;
    }

    async setNft(nft: any[]) {
        this.nfts = nft
    }
    
    // async checkTokenallowance(marketplaceAddress: string) {
    //     const user = await this.contractService.signer
    //     // const allowance = await this.marketContract.allowance(user, marketplaceAddress)
    //     return allowance
    // }

}