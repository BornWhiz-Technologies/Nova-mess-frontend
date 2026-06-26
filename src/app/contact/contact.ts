import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {

  contactData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  submitForm() {

    console.log(this.contactData);

    alert('Message Sent Successfully!');

    this.contactData = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }
}