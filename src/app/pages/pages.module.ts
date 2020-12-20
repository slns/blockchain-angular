import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PagesRoutingModule } from './pages-routing.module';
import { FormComponent } from './form/form.component';
import { TableComponent } from './table/table.component';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { IconDefinition } from '@ant-design/icons-angular';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { DeleteFill } from '@ant-design/icons-angular/icons';

const icons: IconDefinition[] = [ DeleteFill ];


@NgModule({
  declarations: [FormComponent, TableComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzSelectModule,
    NzSwitchModule,
    NzTableModule,
    NzDropDownModule,
    NzDatePickerModule,
    NzIconModule.forRoot(icons),
  ]
})
export class PagesModule { }
