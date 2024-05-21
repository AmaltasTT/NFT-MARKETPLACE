import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthServices } from './auth.service';
import { Login, SignUp } from '../data-type';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from '../products/products.component';
import { ContractService } from '../products/contract.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit {
  walletAddress: string | null = null;
  showLogin = false;
  isAuthenticated: boolean | undefined;
  errorMessage: string = '';

  constructor(private authService: AuthServices, private router: Router, private productService: ContractService) {}


  ngOnInit(): void {
    if(this.authService.isLoggedIn()) {
      this.isAuthenticated = this.authService.isAuthenticated()
    }
  }

  signUp(data: SignUp) {
    if (this.productService.isWalletConnected) {
      this.authService.signUp(data).subscribe((result) => {
        if (result) {
          this.router.navigate(['explore'])
        }
      })
    } else {
      alert("Connect your wallet")
    }
  }

  login(data: Login) {
    if (this.productService.isWalletConnected) {
      this.authService.logIn(data).subscribe((result) => {
      this.router.navigate(['explore'])
      })
    } else {
      alert("Connect your wallet")
    }
  }

  // login(data: Login): void {
  //   this.authService.logIn(data).subscribe(
  //     () => {        
  //       this.router.navigate(['/']);
  //     },
  //     error => {
  //       this.errorMessage = 'Invalid username or password';
  //     }
  //   );
  // }


  logout(): void {
    // Call logout method from authentication service
    this.authService.logout();
    // Update authentication state
    this.isAuthenticated = false;
  }

  openToLogin() {
    this.showLogin = true;
  }

  openSignup() {
    this.showLogin = false;
  }
}
