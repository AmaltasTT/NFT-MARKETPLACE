import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { authGuard } from './auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { NftComponent } from './nft/nft.component';
import { BuyComponent } from './profile/buynft.component';
import { TokenswapComponent } from './tokenswap/tokenswap.component';
import { ListNftComponent } from './list-nft/list-nft.component';
import { NftdetailComponent } from './nftdetail/nftdetail.component';
import { DealComponent } from './deal/deal.component';
import { AuctionComponent } from './auction/auction.component';

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent
    },
    {
        path: 'auth',
        component: AuthComponent
    },
    {
        path: 'explore',
        component: ProductsComponent,
    },
    {
        path: 'profile',
        component: ProfileComponent
    },
    {
        path: 'create-nft',
        component: NftComponent
    },
    {
        path: 'list-nft/:id/:nftId',
        component: ListNftComponent
    },
    {
        path: 'nft-detail/:id/:nftId',
        component: NftdetailComponent
    },
    {
        path: 'buy-nft/:id/:nftId',
        component: BuyComponent
    },
    {
        path: 'swap',
        component: TokenswapComponent
    },
    {
        path: 'deal',
        component: DealComponent
    },
    {
        path: 'auction/:id/:nftId',
        component: AuctionComponent
    }

];
