import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonServiceService } from '../common-service.service';

@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.css']
})
export class ViewDetailsComponent implements OnInit {
  editTenderId:any
  viewObj:any
  constructor(private api: CommonServiceService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.editTenderId = params.get('id'); 
      this.api.setHttp('get', 'Tender/Management/get-tenderbyid?id=' + this.editTenderId, false, false, false, 'baseURL');
    this.api.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == 200) {
          this.viewObj = res.responseData;
          console.log(this.viewObj);
          
        }
      })
    })    
    })
    
  }

  getTenderById() {
    this.api.setHttp('get', 'Tender/Management/get-tenderbyid?id=' + this.editTenderId, false, false, false, 'baseURL');
    this.api.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == 200) {
          this.viewObj = res.responseData;
          console.log(this.viewObj);
          
        }
      })
    })
  }

}
