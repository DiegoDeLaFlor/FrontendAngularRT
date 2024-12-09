import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { DivisionTableComponent } from './division-table/division-table.component'
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule ,RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, DivisionTableComponent, NzTableModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Reto-Tecnico';
  isCollapsed = false;
}
