import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";

@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.css"]
})
export class PaginationComponent implements OnInit {
  @Input() currentPage: number;
  @Input() totalPage: any;
  @Input() showExportData: string = 'false';
  @Output() pageChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() sizeChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() exportData: EventEmitter<string> = new EventEmitter<string>();

  constructor(private fb: FormBuilder) {}

  Pages: FormGroup;
  patientCategories = [
    {
      id: 1,
      name: "20"
    },
    {
      id: 2,
      name: "50"
    },
    {
      id: 3,
      name: "100"
    }
  ];

  ngOnInit() {
    this.Pages = this.fb.group({
      Pages: [null, Validators.required]
    });
    const toSelect = this.patientCategories.find(c => c.id == 1);
    this.Pages.get("Pages").setValue(toSelect);
  }

  pageClick(type) {
    this.pageChange.emit(type);
  }

  onSizeChange(e) {
    this.sizeChange.emit(e.value.name);
  }

  export() {
    this.exportData.emit();
  }
}
