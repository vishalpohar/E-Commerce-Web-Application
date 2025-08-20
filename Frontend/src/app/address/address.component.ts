import { CommonModule } from '@angular/common';
import { Component, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Address, AddressService } from '../services/address/address.service';
import { UserService } from '../services/Users/user.service';

@Component({
  selector: 'app-address',
  imports: [CommonModule, FormsModule],
  templateUrl: './address.component.html',
  styleUrl: './address.component.css',
})
export class AddressComponent {
  userId: number = 0;
  showForm = false;

  shippingAddress: Address = {
    userId: 0,
    fullName: '',
    phone: '',
    state: '',
    district: '',
    city: '',
    pinCode: '',
    addressLine: '',
  };

  constructor(
    private addressService: AddressService,
    private userService: UserService
  ) {}

  @Input() mode: string = ''; // default is add

  @Input() set existingAddress(value: any) {
    if (this.mode === 'edit' && value && Object.keys(value).length > 0) {
      this.shippingAddress = { ...value };
    }
  }

  ngOnInit() {
    this.userService.user$.subscribe((user) => {
      if (user?.id) {
        this.userId = user.id;
        this.shippingAddress.userId = user.id;
      }
    });
  }

  openModal() {
    this.showForm = true;
  }

  closeModal() {
    this.showForm = false;
  }

  onSubmit(form: any) {
    if (!form.valid) {
      alert('Please fill all the required fields!');
    } else {
      if (this.mode === 'add') {
        this.addAddress();
      } else if (this.mode === 'edit') {
        this.updateAddress();
      }
    }
  }

  addAddress() {
    this.addressService.saveAddress(this.shippingAddress);
    this.closeModal();
  }

  updateAddress() {
    this.addressService.updateAddress(this.shippingAddress);
    this.closeModal();
  }
}
