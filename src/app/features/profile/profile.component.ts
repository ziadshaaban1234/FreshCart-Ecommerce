import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-profile',
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {}
