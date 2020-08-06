import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'

import { GroupsService } from '../core/groups.service'
import { IGroup, IMember, IUser } from '../shared/interfaces'
import { AuthService } from '../core/auth.service'
import { FriendsService } from '../core/friends.service';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  public groups: IGroup[];
  public group: IGroup;
  public members: any[]
  private _friendId=null

  currentUser: IUser;
  isAdmin= false;

  friends=[]
  friendInput=''
  visible= true

  fadelete = faMinusCircle;

  constructor(
    private groupsServ: GroupsService,
    private toastr: ToastrService,
    private authenticationService: AuthService,
    private friendsServ:FriendsService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.group={name:'', admin:'', _id:'', members:[]}
  }

  ngOnInit(): void {
    this.getGroups()
  }

  addGroup(f: NgForm) {
    this.groupsServ.createGroup(f.value.name).subscribe(() => { this.getGroups(); f.reset() }),
      (err) => this.toastr.error(err)
  }

  setFriendId(id: string) {   
    this._friendId = id;
    this.visible=false
  }

  getGroups() {
    this.groupsServ.getGroups("").subscribe((groups) => { this.groups = groups;  this.group= this.groups[0];console.log(groups[0]); this.members= groups[0].members},
      (err) => this.toastr.error(err))
  }

  getGroupMembers(id) {
    this.groupsServ.getGroupMembers(id).subscribe((group: IGroup) =>{ this.group = group; this.members= group.members;
     this.isAdmin= this.currentUser._id == group.admin

    },
      (err) => this.toastr.error(err))
  }

  addMemberToGroup(f:NgForm){
    this.groupsServ.addMemberToGroup(this._friendId, this.group._id).subscribe(()=> {this.getGroupMembers(this.group._id); f.reset(); },(err)=> this.toastr.error(err))
  }

  getFriends(name){
   this.friendsServ.getFriends(name).subscribe((friends)=> this.friends=friends,(err)=> this.toastr.error(err))
  }

  removeMemberFromGroup(groupId,memberId){
    this.groupsServ.removeMemberFromGroup(groupId,memberId)
    .subscribe(()=>{this.getGroupMembers(this.group._id)},
    (err)=> this.toastr.error(err))
  }

  deleteGroup(groupId){
    this.groupsServ.deleteGroup(groupId).subscribe(()=> this.getGroups(),(err)=> this.toastr.error(err))
  }

}
