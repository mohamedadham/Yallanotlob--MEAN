import { Component, OnInit } from '@angular/core';
import { FriendsService } from '../core/friends.service';
import { IFriend } from '../shared/interfaces';
import { NgForm } from '@angular/forms'
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  public friends: any[];

  constructor(private friendsServ: FriendsService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.friendsServ.getFriends("").subscribe((friends: IFriend[]) => { this.friends = friends })

  }
  
  unfriend(id: any): void {
    this.friendsServ.unFriend(id)
    .subscribe(() => this.friendsServ.getFriends("")
    .subscribe((friends: IFriend[]) => { this.friends = friends }))

  }

  addFriend(f: NgForm): void {
    this.friendsServ.addFriend(f.value.email).subscribe(
      (response) => {
        this.friendsServ.getFriends("").subscribe((friends: IFriend[]) => { this.friends = friends });
        f.reset();
        this.toastr.success(response.message)

      },
      (err) => this.toastr.error(err)
    )

  }


}