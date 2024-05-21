import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { ProfileServices } from '../profile/profile.service';
import { ContractService } from '../products/contract.service';
import { infinityAbi } from '../contact-abi/infinity-coin.abi';


@Injectable({
  providedIn: 'root'
})
export class TokenswapService {

  erc20Contract: any;
  ethToToken: string = ''
  tokenToEth: string = ''
  provider: any;


  constructor(private profileService: ProfileServices, private contractService: ContractService) {
    this.provider = new ethers.BrowserProvider(window.ethereum)
    const erc20TokenAddress = this.profileService.erc20TokenContractAddress
    const tokenAbi = infinityAbi;
    this.erc20Contract = new ethers.Contract(erc20TokenAddress, tokenAbi, this.provider)
  }


  async swapEtherForToken(etherAmount: string): Promise<void> {
    try {
      const user = await this.provider.getSigner()
      const connectSigner = await this.erc20Contract.connect(user)
      const ethAmtInWei = await ethers.parseEther(etherAmount) // Convert eth amount in wei
      const data = await connectSigner.swapEtherForTokens({ value: ethAmtInWei })
      const tx = await data.wait()
    } catch (error) {
      console.error('Error while swapping ether for tokens:', error);
    }
  }

  async swapTokensForEther(tokenAmount: string) {
    try {
      const user = await this.provider.getSigner()
      const connectSigner = await this.erc20Contract.connect(user)
      const tokenAmtInWei = await ethers.parseEther(tokenAmount) // Convert token amount in wei
      const data = await connectSigner.swapTokensForEther(tokenAmount)
      const res = await data.wait()
    } catch (error) {
      console.error('Error while swapping ether for tokens:', error);
    }
  }

  // get amount of token
  async calculateTokenAmount(etherAmount: string) {
    try {
      const ethAmtInWei = ethers.parseEther(etherAmount) // Convert eth amount in wei
      const data = await this.erc20Contract.calculateTokenAmountForEther(ethAmtInWei)
      this.ethToToken = data
    } catch (error) {
      console.error('Error Calculating Tokens', error);
    }
  }

  // Get value of ether 
  async calculateEtherAmount(tokenAmount: string) {
    try {
      const data = await this.erc20Contract.calculateEtherAmountForTokens(tokenAmount)
      this.tokenToEth = data
    } catch (error) {
      console.error('Error Calculating Tokens', error);
    }
  }
}
