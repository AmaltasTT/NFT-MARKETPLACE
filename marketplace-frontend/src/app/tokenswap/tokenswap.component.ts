import { Component, OnInit } from '@angular/core';
import { TokenswapService } from './tokenswap.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ethers } from 'ethers';

@Component({
  selector: 'app-tokenswap',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tokenswap.component.html',
  styleUrl: './tokenswap.component.css'
})
export class TokenswapComponent implements OnInit{
  etherAmount: string = '';
  TokenAmount: string = ''

  ethToTokenValue: string = ''
  tokentoEthValue: string = ''
  tokenBalance: any;
  ethBalance: string = '';
  constructor(private tokenswapService: TokenswapService) { }

  async swapEther() {
    return await this.tokenswapService.swapEtherForToken(this.etherAmount)
  }

  async swapToken() {
    return await this.tokenswapService.swapTokensForEther(this.TokenAmount)

  }
  async onValue(event: any) {
    if (event?.target?.value) {
      const value = await this.tokenswapService.calculateTokenAmount(this.etherAmount)
      const weiAmtinEth = await ethers.formatEther(this.tokenswapService.ethToToken)
      this.ethToTokenValue = weiAmtinEth
    }
  }

  async onTokenValue(event: any) {
    if (event?.target?.value) {
      const value = await this.tokenswapService.calculateEtherAmount(this.TokenAmount)
      const weiAmtinEth = await ethers.formatEther(this.tokenswapService.tokenToEth)
      this.tokentoEthValue = weiAmtinEth
    }
  }

  async getTokenbalance() {
    const user = await this.tokenswapService.provider.getSigner()
    const bal = await this.tokenswapService.erc20Contract.balanceOf(user.address)
    this.tokenBalance = ethers.formatEther(bal)
    const ethBal = await this.tokenswapService.provider.getBalance(user.address)
    const balInEth = ethers.formatEther(ethBal)
    this.ethBalance = Number(balInEth).toFixed(4)
  }

  async ngOnInit(): Promise<void> {
    await this.getTokenbalance()
  }
  
}

