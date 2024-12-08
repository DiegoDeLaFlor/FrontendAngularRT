import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
    NzPaginationModule
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
  sortMap = new Map<string, 'ascend' | 'descend' | null>();
  pagination = {
    pageSize: 10,
    pageIndex: 1
  };

  constructor(private divisionService: DivisionService, private fb: FormBuilder) {
    this.divisionForm = this.fb.group({
      name: [''],
      upperDivisionId: [null],
      collaborators: [0],
      ambassadorName: [''],
    });
  }

  ngOnInit(): void {
    this.loadDivisions();
  }

  loadDivisions() {
    this.loading = true;
    this.divisionService.getDivisions().subscribe((data) => {
      this.divisions = data.map((division) => ({
        ...division,
        subdivisions: data.filter((d) => d.upperDivisionId === division.id).length,
        upperDivisionName: data.find((d) => d.id === division.upperDivisionId)?.name || null,
      }));
      this.tableData = [...this.divisions];
      this.loading = false;
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
  onQueryParamsChange(params: any): void {
    const { pageSize, pageIndex } = params;
    this.pagination = { pageSize, pageIndex };
  }

  onSort(sort: any): void {
      //console.log(sort);
        if(sort.value === null){
            this.sortMap.delete(sort.key);
        }else{
            this.sortMap.set(sort.key, sort.value);
        }
  }
}
