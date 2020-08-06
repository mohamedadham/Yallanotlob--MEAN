import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FriendsService } from '../../core/friends.service';
import { GroupsService } from '../../core/groups.service';
import { IFriend, IGroup } from '../../shared/interfaces';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { OrdersService } from '../../core/orders.service';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  friends: IFriend[] = [{ _id: '', name: '' }];
  groups: IGroup[];
  friendInput: ''
  invitedGroup: { id, name };
  invitedFriends: any[] = []
  fileUploadForm: FormGroup;
  fileInputLabel: string;
  @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;

  constructor(
    private friendsServ: FriendsService,
    private groupServ: GroupsService,
    private toastr: ToastrService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private ordersServ: OrdersService


  ) {
    this.invitedGroup = { id: "", name: "" }

  }

  ngOnInit(): void {
    this.fileUploadForm = this.formBuilder.group({
      uploadedImage: ['']
    });
  }

  getGroupsAndFriends(model) {
    if (model.value.length == 0) {
      this.friends = [];
      this.groups = []
    }
    else {
      if (this.friends.length == 0) {
        this.groupServ.getGroups(model.value).subscribe((groups) => { this.groups = groups; console.log(this.groups) }), (err) => { this.groups = []; this.toastr.error(err) }
      }
      this.friendsServ.getFriends(model.value).subscribe((friends) => { this.friends = friends; console.log(this.friends) }), (err) => { this.friends = []; this.toastr.error(err) }
    }
  }

  addGroupToOrder(id, name) {
    if (this.invitedFriends.length>0) {
      this.toastr.warning("Add members or a group ")
      return false;
    }
    this.invitedGroup = { id, name }
    this.friends = []
    this.groups = []
  }

  addMembersToOrder(id, name) {
    for(let i=0; i<this.invitedFriends.length; i++){
      if (this.invitedFriends[i].id === id) {
        this.toastr.warning("User is already Invited")
        return false;
      }
    }
    
    this.invitedFriends.push({ id, name })
    this.friends=[]
    this.groups=[]
    this.friendInput=''
  }

  removeMemberFromOrder(id) {
    for (let i = 0; i < this.invitedFriends.length; i++) {
      if (this.invitedFriends[i].id === id) {
        this.invitedFriends.splice(i, 1);
      }
    }
  }

  removeGroupFromOrder() {
    this.invitedGroup = { id: "", name: "" }
  }

  onFileSelect(event) {
    const file = event.target.files[0];
    this.fileInputLabel = file.name;
    this.fileUploadForm.get('uploadedImage').setValue(file);
  }

  onFormSubmit(f) {
    if (f.value.menu == "") {
      this.toastr.error('Please select Image');
      return false;
    }
    else if (this.invitedFriends.length === 0 && this.invitedGroup.id == "") {
      this.toastr.error('Please Choose Friend or Group');
      return false;
    }

    let formData = new FormData();
    formData.append('uploadedImage', this.fileUploadForm.get('uploadedImage').value);

    this.http
      .post<any>('http://localhost:3000/uploadfile', formData).subscribe(response => {
        if (response.statusCode === 200) {

          f.value.friends = this.invitedFriends.map(invitedFriend => { return { member: invitedFriend.id } })

          f.value.menuImage = response.uploadedFile.filename

          if (this.invitedFriends.length > 0) {

            this.ordersServ.addOrderwithFriends(f.value)
              .subscribe((response) => {
                this.reset();
                f.reset()
                this.toastr.success(response.message)
              }, (err) => this.toastr.error(err))
          }
          else {

            f.value.groupId = this.invitedGroup.id
            f.value.friends = null


            this.ordersServ.addOrderwithGroup(f.value)
              .subscribe((response) => {
                this.reset();
                f.reset()
                this.toastr.success(response.message)
              }, (err) => this.toastr.error(err))
          }
        }
      }, er => {
        this.toastr.error(er.error.error)
      });
  }

  reset() {
    this.friends = [];
    this.groups = []
    this.invitedFriends = [];
    this.invitedGroup = { id: "", name: "" }
  }

}
