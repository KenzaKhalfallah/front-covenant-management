import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}
  logout(): void {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    console.log(localStorage.getItem('token'));
    this.router.navigate(['/login']);
  }
}
