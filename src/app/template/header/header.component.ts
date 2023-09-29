import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  isHeaderFixed = false;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (window.pageYOffset > 50) {
      this.isHeaderFixed = true;
    } else {
      this.isHeaderFixed = false;
    }
  }

  logout(): void {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    console.log(localStorage.getItem('token'));
    this.router.navigate(['/login']);
  }
}
