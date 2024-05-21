import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderServices } from './header.service';
import { Router } from '@angular/router';
import { AuthServices } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { ContractService } from '../products/contract.service';
import { injected } from 'web3modal';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  buttonNameToggle = true;
  buttonName: 'connect' | 'disconnect' = 'connect';
  walletConnected: boolean = false;
  userBalance: string | null = null;
  shortAddress: string | null = null;

  constructor(private headerService: HeaderServices, private route: Router, private authService: AuthServices, private contractService: ContractService) {
    
   }

  // if (this.buttonName == 'connect') {
  //   this.buttonName = this.buttonNameToggle ? 'connect' : 'disconnect';

  // } else {
  //   this.buttonName = 'connect';
  // }
  
  async init() {
    const storedAccount = localStorage.getItem('ethereum_account')
    if(storedAccount) {
        await this.connectMetamask()
    }
}

  async connectMetamask() {
    const useraddress = await this.contractService.provider.getSigner()
    const signerAddress = useraddress.address
    const start = signerAddress.slice(0, 4);
    const end = signerAddress.slice(-4);
    this.shortAddress = start + '***' + end
    this.walletConnected = true;
    return this.headerService.connectMetamask()
  }

  ngOnInit(): void {
    this.init()
    if(localStorage.getItem("authToken")) {
      this.isLoggedIn = true
    }
  }

  logout() {
    this.isLoggedIn = false
    this.walletConnected = false;
    localStorage.removeItem("ethereum_account")
    this.authService.logout();
  }
}

function activate(injected: any) {
  throw new Error('Function not implemented.');
}

