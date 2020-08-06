import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { NgForm, FormGroup, FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  registerUserData = { name: "", email: "", password: "" }
  fileUploadForm: FormGroup;
  fileInputLabel: string;
  @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;


  constructor(
    private _auth: AuthService,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private toastr: ToastrService

  ) { }

  ngOnInit(): void {
    this.fileUploadForm = this.formBuilder.group({
      uploadedImage: ['']
    });
  }

  onFileSelect(event) {
    const file = event.target.files[0];
    this.fileInputLabel = file.name;
    this.fileUploadForm.get('uploadedImage').setValue(file);
  }

  onSubmit(f: NgForm) {

    if (f.valid) {
      let formData = new FormData();
      formData.append('uploadedImage', this.fileUploadForm.get('uploadedImage').value);

      this.http
        .post<any>('http://localhost:3000/uploadfile', formData).subscribe(response => {

          if (response.statusCode === 200) {

            f.value.image = response.uploadedFile.filename
            this._auth.registerUser(
              f.value.name,
              f.value.email,
              f.value.password,
              f.value.image
            )
              .subscribe(
                res => {
                  console.log(res)
                  this.router.navigate(['/login'])
                },
                err => this.toastr.error(err)
              )
          }
        })
    }
  }
}
