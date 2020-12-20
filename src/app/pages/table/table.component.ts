import { Component, OnInit } from '@angular/core';
import format from 'date-fns/format';
import { LocalStorageService } from 'src/app/services/local-storage.service';

interface DataItem {
  id: number;
  date: string;
  currency: number;
  amount: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  date = null;
  searchValue = '';
  searchValueID = '';
  visible = false;
  visibleID = false;
  loadID = [];

  dataTable = [];
  listOfData: DataItem[] = [];
  listOfDisplayData = [];

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.dataTable = this.localStorageService.get();
    for (const key in this.dataTable) {
      this.listOfData.push({
        id: this.dataTable[key].id,
        date: this.dataTable[key].date,
        currency: this.dataTable[key].amountSelect.value,
        amount: `${this.dataTable[key].amounts} - ${this.dataTable[key].amountSelect.value}`,
      });
    }
    this.listOfDisplayData = [...this.listOfData];
  }

  listOfSelection = [
    {
      text: 'Select All Row',
      onSelect: () => {
        this.onAllChecked(true);
      }
    },
    {
      text: 'Select Odd Row',
      onSelect: () => {
        this.listOfDisplayData.forEach((data, index) => this.updateCheckedSet(data.id, index % 2 !== 0));
        this.refreshCheckedStatus();
      }
    },
    {
      text: 'Select Even Row',
      onSelect: () => {
        this.listOfDisplayData.forEach((data, index) => this.updateCheckedSet(data.id, index % 2 === 0));
        this.refreshCheckedStatus();
      }
    }
  ];

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.listOfDisplayData.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: DataItem[]): void {
    this.listOfDisplayData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfDisplayData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfDisplayData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  removeLine(id) {
    const blockchainArray = this.localStorageService.get();
    const removeIndex = blockchainArray.map(function(item) { return item.id; }).indexOf(id);
    blockchainArray.splice(removeIndex, 1);
    this.listOfDisplayData = [...blockchainArray];
    this.persist(JSON.stringify(blockchainArray));
  }

  persist(value: any) {
    this.localStorageService.set('blockchain', value);
  }

  removeALL() {
    this.localStorageService.remove('blockchain');
  }


  onChange(result: Date): void {
    this.searchValue = format(result, 'dd/MM/yyyy');
    this.searchDate();
  }

  reset(): void {
    this.searchValue = '';
    this.searchValueID = '';
    this.loadID = [];
    this.searchDate();
  }

  searchDate(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfData.filter(
      (item: DataItem) => item.date.indexOf(this.searchValue) !== -1
    );
  }

  searchID(result): void {
    this.loadDataID();
    result.target.value = '';
    let intervalID = setInterval(() => {
      if (result.target.value != '') {
        this.loadDataID();
      } else {
        this.listOfDisplayData = this.loadID;
        this.visibleID = false;
        clearInterval(intervalID);
      }
    }, 3000);
  }

  loadDataID() {
    this.loadID.push(
      ...this.listOfData.filter(
        (item: DataItem) => item.id === parseInt(this.searchValueID)
      )
    );
    this.searchValueID = '';
  }
}
