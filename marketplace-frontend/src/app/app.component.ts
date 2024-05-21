import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { ProductsComponent } from "./products/products.component";
import { AuthComponent } from "./auth/auth.component";
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NftComponent } from './nft/nft.component';
import { ProfileComponent } from './profile/profile.component';
import { BuyComponent } from './profile/buynft.component';
import { ListNftComponent } from './list-nft/list-nft.component';
import { ListServices } from './list-nft/list-nft.service';
import { NftdetailComponent } from './nftdetail/nftdetail.component';
import { AuctionComponent } from './auction/auction.component';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    RouterOutlet, HeaderComponent, ProductsComponent,
    AuthComponent, HttpClientModule, NftComponent,
    ProfileComponent, ListNftComponent, BuyComponent,
    NftdetailComponent, AuctionComponent
  ],
  providers: [ListServices]
})
export class AppComponent {
  title = 'NFT-Market-Place';
}
