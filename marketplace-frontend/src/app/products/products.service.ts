// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './products.model';
import { ContractService } from './contract.service';
import { Owner } from '../data-type';
import axios from 'axios';
import { NftService } from '../nft/nft.service';


@Injectable({
    providedIn: 'root'
})

export class ProductService {
    private apiUrl = 'http://localhost:3000/nft'; 
    
    nftMetadata: string | null = null;
    constructor(private http: HttpClient, private contractService: ContractService, private nftService: NftService) { }

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiUrl);
    }

    listedNft(nftAddress:string): Observable<any>  {
        return this.http.get<any>(`${this.apiUrl}/list/${nftAddress}`)
    }

}
