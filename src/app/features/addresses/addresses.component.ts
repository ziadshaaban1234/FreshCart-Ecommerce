import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressesService } from '../../core/services/addresses/addresses.service';
import { IAddress } from '../../core/models/IAddress/iaddress.interface';

@Component({
  selector: 'app-addresses',
  imports: [ReactiveFormsModule],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.css',
})
export class AddressesComponent {
  private readonly fb = inject(FormBuilder);
  private readonly addressesService = inject(AddressesService);
  userAddresses: WritableSignal<IAddress[]> = signal([]);
  addressForm!: FormGroup;
  showAddAddressModal: WritableSignal<boolean> = signal(false);
  formTitle: WritableSignal<string> = signal('');
  initForm() {
    this.addressForm = this.fb.group({
      name: [null, [Validators.required]],
      details: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      city: [null, [Validators.required]],
    });
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getUserAddresses();
    this.initForm();
  }

  getUserAddresses() {
    this.addressesService.getLoggesUserAddresses().subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === 'success') {
          this.userAddresses.set(res.data);
        }
      },
      error: (err) => {
        console.log(err);
        this.userAddresses.set([]);
      }
    });
  }

  addAdrress() {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      console.log('Form is invalid, stopping submit');
      return;
    }
    else {
      const payload = this.addressForm.value;
      if (this.currentAddressId() != null) {//kda e7na edit
        this.deleteAdrress(this.currentAddressId()!);
      }

      this.addressesService.addNewAddress(payload).subscribe({
        next: (res) => {
          console.log(res);
          if (res.status === 'success') {
            this.userAddresses.set(res.data);
            this.getUserAddresses();
            this.showAddAddressModal.set(false);
          }
        },
        error: (err) => {
          console.log(err);
          this.userAddresses.set([]);
        }
      });

    }
  }

  deleteAdrress(addressId: string) {
    console.log(addressId);
    this.showAddAddressModal.set(false);
    this.addressesService.removeSpecificAddress(addressId).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === 'success') {
          this.userAddresses.set(res.data);
          this.getUserAddresses();
        }
      },
      error: (err) => {
        console.log(err);
        this.userAddresses.set([]);
      }
    });
  }
  currentAddressId = signal<string | null>(null);
  openEditModal(address: any) {
    this.formTitle.set('Edit Address');
    this.currentAddressId.set(address._id);
    this.addressForm.patchValue({
      name: address.name,
      details: address.details,
      phone: address.phone,
      city: address.city
    });

    this.showAddAddressModal.set(true);
  }
  closeModal() {
    this.showAddAddressModal.set(false);
    this.addressForm.reset();
    this.currentAddressId.set(null);
  }

  openAddModal() {
    this.formTitle.set('Add New Address');
    this.addressForm.reset();
    this.currentAddressId.set(null);
    this.showAddAddressModal.set(true);
  }
}
