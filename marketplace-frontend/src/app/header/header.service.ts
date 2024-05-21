import { Injectable } from '@angular/core';
import Web3Modal from "web3modal";
import { ContractService } from '../products/contract.service';

@Injectable({
    providedIn: 'root'
})
 
export class HeaderServices {
    constructor(private contractService: ContractService){ }

    connectMetamask() {
       this.contractService.connect()
    }
}