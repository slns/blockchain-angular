import { Component } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { of } from 'rxjs';
import format from 'date-fns/format';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent {
  id = 1;
  validateForm: FormGroup;
  internalAccountsToDebit = [];
  amountSelect = [];
  internalAccountsToDebitValue = null;
  destinationValue = null;
  selectedAmount = null;
  feePaidByReceiver = false;
  amountSelectValue = { id: '2', value: 'EURO' };

  localStorageChanges$ = this.localStorageService.changes$;

  getInternalAccountsToDebit() {
    return [
      { id: '1', value: 'Account 1' },
      { id: '2', value: 'Account 2' },
      { id: '3', value: 'Account 3' },
      { id: '4', value: 'Account 4' },
    ];
  }

  getAmounts() {
    return [
      { id: '1', value: 'XTZ' },
      { id: '2', value: 'EURO' },
      { id: '3', value: 'DOLLAR' },
      { id: '4', value: 'REAL' },
    ];
  }

  constructor(
    private fb: FormBuilder,
    private localStorageService: LocalStorageService
  ) {
    this.validateForm = this.fb.group({
      internalAccountsToDebit: ['', [Validators.required]],
      amounts: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(1),
        ],
      ],
      amountSelect: ['', [Validators.required]],
      feePaidByReceiver: ['', [Validators.required]],
      destination: ['', [Validators.required]],
      metadatas: this.fb.array([this.newMetadata()]),
    });

    of(this.getInternalAccountsToDebit()).subscribe(
      (internalAccountsToDebit) => {
        this.internalAccountsToDebit = internalAccountsToDebit;
      }
    );
    of(this.getAmounts()).subscribe((amounts) => {
      this.amountSelect = amounts;
    });
  }

  persist(value: any) {
    this.localStorageService.set('blockchain', value);
  }

  removeALL() {
    this.localStorageService.remove('blockchain');
  }

  // tslint:disable-next-line:no-any
  compareFn = (o1: any, o2: any) =>
    o1 && o2 ? o1.value === o2.value : o1 === o2;

  metadatas(): FormArray {
    return this.validateForm.get('metadatas') as FormArray;
  }

  newMetadata(): FormGroup {
    return this.fb.group(
      {
        metadataKey: '',
        metadataValue: '',
      },
      {
        validator: this.confirmMetadata('metadataKey', 'metadataValue'),
      }
    );
  }

  addMetadata() {
    this.metadatas().push(this.newMetadata());
  }

  removeMetadata(i: number) {
    this.metadatas().removeAt(i);
  }

  submitForm(value: {
    id: number;
    internalAccountsToDebit: string;
    amounts: string;
    amountSelect: string;
    feePaidByReceiver: string;
    destination: string;
    metadataKey: string;
    date: string;
    metadataValue: string;
  }): void {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    value.date = format(new Date(), 'dd/MM/yyyy H:m:s');
    value.id = this.id++;
    let blockchain = [];

    if (this.localStorageService.get()) {
      blockchain = this.localStorageService.get();
      blockchain.push(value);
      this.persist(JSON.stringify(blockchain));
    } else {
      blockchain.push(value);
      this.persist(JSON.stringify(blockchain));
    }
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }

  confirmMetadata(field1: string, field2: string) {
    return function (frm) {
      let field1Value = frm.get(field1).value;
      let field2Value = frm.get(field2).value;

      if (field1Value || field2Value) {
        return null;
      }
      return { match: `At least one metadata must be filled` };
    };
  }
}
