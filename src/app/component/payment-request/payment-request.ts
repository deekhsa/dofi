import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbCalendar, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-payment-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgSelectModule, NgbDatepickerModule],
  templateUrl: './payment-request.html',
  styleUrls: ['./payment-request.scss'],
})
export class PaymentRequest implements OnInit {
  modalRef!: NgbModalRef;
  paymentDetailsForm!: FormGroup;
  uploadedFileName: string | null = null;
  tableRows: any[] = [];
  totalLocalAmt: number = 0;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  paymentTypes = ['Cash', 'Bank'];
  currencyList = [
    { CurrencyValue: 'dollar', currencyName: 'Dollar' },
    { CurrencyValue: 'rupee', currencyName: 'Rupee' },
  ];
  paymentRequestStatuses = [
    { value: 'Pending', label: 'Waiting for Approval' },
    { value: 'Approved', label: 'Approved' },
    { value: 'Rejected', label: 'Rejected' },
    { value: 'WaitingForFinalApproval', label: 'Waiting For Final Approval' },
    { value: 'WaitingForCustomerApproval', label: 'Waiting For Customer Approval' },
    { value: 'Counter', label: 'Counter' },
  ];
  party = ['Vendor', 'Client'];
  status = ['Active', 'Suspend'];
  Department = ['finance', 'transport'];

  constructor(private modalService: NgbModal, private fb: FormBuilder, private calendar: NgbCalendar) {}

  ngOnInit(): void {
    this.initDetailsForm();
  }

  onAddRow() {
    const newRow = {
      charge: '',
      unit: '',
      numOfUnit: null,
      currency: '',
      exRate: null,
      perUnit: null,
      amount: null,
      localAmt: 0,
      party: ''
    };
    this.tableRows.push(newRow);
    this.calculateTotalLocalAmt();
  }

  calculateTotalLocalAmt() {
    this.totalLocalAmt = this.tableRows.reduce((sum, r) => sum + (parseFloat(r.localAmt) || 0), 0);
  }

  private initDetailsForm() {
    const today: NgbDateStruct = this.calendar.getToday();
    this.paymentDetailsForm = this.fb.group({
      paymentRequestNo: [''],
      PaymentType: ['Bank', Validators.required],
      PaymentPayableTo: ['', Validators.required],
      paymentRequestDate: [today, Validators.required],
      paymentCurrency: [null, Validators.required],
      PaymentRequestStatus: [null, Validators.required],
      paymentStatus: ['Active', Validators.required],
      PaymentDepartment: [null, Validators.required],
      paymentParty: [null, Validators.required],
      PaymentBookingNo: [null, Validators.required],
      PaymentHBLNo: [null, Validators.required],
      PaymentMBLNo: [null, Validators.required],
      PaymentRemarks: [null, Validators.required],
    });
  }

  onModalSave() {
    if (this.paymentDetailsForm.invalid) {
      this.paymentDetailsForm.markAllAsTouched();
      return;
    }
    this.calculateTotalLocalAmt();
    const payload = {
      ...this.paymentDetailsForm.getRawValue(),
      UploadedFile: this.uploadedFileName,
      TableRows: this.tableRows,
    };

    console.log('Payload:', payload);
    this.modalRef.close();
  }

  openTariffDetailEntryModal(content: TemplateRef<any>, data?: any) {
    this.tableRows=[]
    //for display purpose i have initialized with dummy data for preview fetch from api and for edit initialize empty fields . 
    this.tableRows.push ({
      charge: 'vendor',
      unit: 5.3,
      numOfUnit: 40,
      currency: 'ruppee',
      exRate: 50,
      perUnit: 100,
      amount: 20,
      localAmt: 100,
      party: 'finance'
    });
    this.initDetailsForm();
    this.setRandomRequestNumber();
    this.calculateTotalLocalAmt();
    this.uploadedFileName = null;

    this.modalRef = this.modalService.open(content, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });
  }

  setRandomRequestNumber() {
    const randomNum = Math.floor(Math.random() * 1000000) + 1;
    this.paymentDetailsForm.get('paymentRequestNo')?.setValue(randomNum);
  }
  onAttachDocument() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.uploadedFileName = file.name;
      console.log('Uploaded file:', file);
    }
  }

}
