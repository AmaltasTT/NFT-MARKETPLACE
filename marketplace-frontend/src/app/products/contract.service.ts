import { Component, Injectable } from '@angular/core';
import { contractAbi } from './contract.abi';
import { ethers } from 'ethers';
import { Product } from './products.model';
import { ProductService } from './products.service';
import { Router } from '@angular/router';


@Injectable({
    providedIn: 'root'
})

export class ContractService {
    contract: any;
    signer: any;
    provider: any;
    walletAddress: string = "";
    userBalance: number | null = null;
    isWalletConnected: boolean = false;
    products: Product[] = [];
    account: string = ''

    constructor(private router: Router) {
        this.provider = new ethers.BrowserProvider(window.ethereum)
        const contractAddress = "0x0e63d28b1b982c3A3BFf87F048cB4202c11e69d2"
        const abi = contractAbi;
        this.contract = new ethers.Contract(contractAddress, abi, this.provider)
    }

    async connect() {
        if(window.ethereum) {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.provider = new ethers.BrowserProvider(window.ethereum);
            const account = await this.provider.getSigner()
            this.signer = account.address
            this.walletAddress = this.signer.address;
            this.isWalletConnected = true;
            localStorage.setItem('ethereum_account', this.signer);

            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                if(accounts.length > 0) {
                    this.signer = accounts[0];
                } else {
                    this.signer = null;
                    localStorage.removeItem("ethereum_account")
                }
            });
        } else {
            console.error("Metamask not found");
            
        } 
        return this.signer
    }
    
    async fetchBalance() {
        const userAddress = await this.provider.getSigner();
        const balanceInWei = await this.provider.getBalance(userAddress);
        const balanceInEther = ethers.formatUnits(balanceInWei, "ether")
        return balanceInEther;
    }

    async getTokenBalance() {
        const user = await this.signer.address
        const data = await this.contract.balanceOf(user)
        const balInEther = await ethers.formatUnits(data.toString(), "ether")
        return balInEther;
    }

    async buyProduct(productId: number, productPrice: number) {
        if (await this.isWalletConnected) {
            const user = await this.signer.address
            const signer = await this.contract.connect(this.signer);
            const price = await productPrice.toString()
            const priceInWei = ethers.parseEther(price)
            const data = await signer._transfer(priceInWei);
            // const receipt = await data.wait(5)
            if (data) {
                this.router.navigate(['profile'])
            }
        } else {
            alert("Connect your wallet")
        }
    }

    async getWalletAddress() {
        return this.walletAddress
    }


}


