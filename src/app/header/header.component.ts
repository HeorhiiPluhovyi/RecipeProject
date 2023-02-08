import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStoredService } from '../shared/data-stored.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  private userSub: Subscription;

  constructor(
    private dataStorageService: DataStoredService,
    private authServise: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userSub = this.authServise.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  onFetchData(): void {
    this.dataStorageService.fetcRecipes().subscribe((response) => {
      console.log('Success fetcRecipes!');
    });
  }

  onSaveData(): void {
    this.dataStorageService.storeRecipes();
  }

  logout(): void {
    this.authServise.logout();
    this.router.navigate(['/auth'])
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
 }
