import { Routes } from '@angular/router';
import { DivisionTableComponent } from './division-table/division-table.component';

export const routes: Routes = [
    { path: '', redirectTo: '/divisions', pathMatch: 'full' },
    { path: 'divisions', component: DivisionTableComponent }
];
