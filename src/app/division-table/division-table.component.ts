import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DivisionService } from '../services/division.service';	
import { DivisionWithSubdivisions } from '../models/division.model';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { ChangeDetectorRef } from '@angular/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
@Component({
  selector: 'app-division-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzInputModule,
    NzIconModule,
    NzModalModule,
    NzFormModule,
    NzSelectModule,
    NzPaginationModule,
    NzTabsModule
  ],
  templateUrl: './division-table.component.html',
  styleUrls: ['./division-table.component.scss'],
})
export class DivisionTableComponent implements OnInit {
  tableData: DivisionWithSubdivisions[] = [];
  divisions: DivisionWithSubdivisions[] = [];
  loading = true;
  isModalVisible = false;
  isEditing = false;
  divisionForm: FormGroup;
  currentEditingId: number | null = null;
  searchValue = '';
  setOfCheckedId = new Set<number>();
  checked = false;
  indeterminate = false;
  sortMap = new Map<string, 'ascend' | 'descend' | null>();
  pagination = {
    pageIndex: 1,
    pageSize: 10,
  };
  total = 0;

  constructor(private divisionService: DivisionService, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.divisionForm = this.fb.group({
      name: ['', Validators.required],
      upperDivisionId: [null, Validators.required],
      collaborators: [0],
      ambassadorName: [''],
    });
  }

  ngOnInit(): void {
    this.loadDivisions();
  }

  loadDivisions() {
    this.loading = true;
    this.divisionService.getDivisions(this.pagination.pageIndex, this.pagination.pageSize)
      .subscribe({
        next: (response) => {
          this.divisions = response.results.map(division => {
            const divisionWithSubdivisions = {
              ...division,
              subdivisions: 0,
              upperDivisionName: division.upperDivision?.name || null
            };
  
            this.divisionService.getSubdivisions(division.id).subscribe({
              next: (subdivisionResponse: any) => {
                if (Array.isArray(subdivisionResponse)) {
                  divisionWithSubdivisions.subdivisions = subdivisionResponse.length;
                } else if (subdivisionResponse?.results && Array.isArray(subdivisionResponse.results)) {
                  divisionWithSubdivisions.subdivisions = subdivisionResponse.results.length;
                } else {
                  console.warn(`Formato inesperado en la respuesta de subdivisiones para la división ${division.id}.`);
                }
              },
              error: (error) => {
                console.error(`Error al cargar subdivisiones para la división ${division.id}`, error);
              }
            });
  
            return divisionWithSubdivisions;
          });
          
          this.tableData = [...this.divisions];
          
          this.pagination.pageIndex = response.page;
          this.pagination.pageSize = response.limit;
          this.total = response.total;

          this.loading = false;
        },
        error: (error) => {
          console.error("Error al cargar divisiones", error);
          this.loading = false;
        }
      });
  }

  openModal(isEditing = false, division: any = null) {
    this.isEditing = isEditing;
    this.isModalVisible = true;
    if (isEditing && division) {
      this.currentEditingId = division.id;
      this.divisionForm.patchValue(division);
    } else {
      this.currentEditingId = null;
      this.divisionForm.reset();
    }
  }

  closeModal() {
    this.isModalVisible = false;
    this.divisionForm.reset();
  }

  saveDivision() {
    const formData = this.divisionForm.value;
    formData.level = Math.floor(Math.random() * 10) + 1;
    formData.collaborators = Math.floor(Math.random() * 10) + 1;
    console.log('Form Data:', formData);
    if (this.isEditing && this.currentEditingId) {
      this.divisionService.updateDivision(this.currentEditingId, formData).subscribe(() => {
        this.loadDivisions();
        this.closeModal();
      });
    } else {
      this.divisionService.createDivision(formData).subscribe(() => {
        this.loadDivisions();
        this.closeModal();
      });
    }
  }

  editDivision(division: DivisionWithSubdivisions) {
    this.openModal(true, division);
  }

  deleteDivision(id: number) {
    if (confirm('¿Está seguro de que desea eliminar esta división?')) {
      this.divisionService.deleteDivision(id).subscribe(() => {
        this.loadDivisions();
      });
    }
  }

  search() {
    if (!this.searchValue) {
      this.tableData = [...this.divisions]; 
      return;
    }
  
    this.tableData = this.divisions.filter((division) => {
      return (
        division.name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        (division.upperDivisionName && division.upperDivisionName.toLowerCase().includes(this.searchValue.toLowerCase())) ||
        (division.ambassadorName && division.ambassadorName.toLowerCase().includes(this.searchValue.toLowerCase()))
      );
    });
  }

  reset() {
    this.searchValue = '';
    this.search();
  }

  onQueryParamsChange(params: { pageIndex: number; pageSize: number }): void {
    this.pagination.pageIndex = params.pageIndex;
    this.pagination.pageSize = params.pageSize;
    this.loadDivisions();
  }

  onSort(sort: any): void {
        if(sort.value === null){
            this.sortMap.delete(sort.key);
        }else{
            this.sortMap.set(sort.key, sort.value);
        }
  }
 // selector
  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.divisions.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.divisions.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.divisions.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }
  
  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }
}
