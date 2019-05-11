import { Component, OnInit, Input } from '@angular/core';
import { FilterService } from '../filter.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  @Input() ebayResults;
  @Input() json_err;
  @Input() progress;
 

  current;
  constructor(private filterservice: FilterService) { }

  ngOnInit() {
    this.current = 1;
    
  }

   wishadd(result){
    this.filterService.wishlistfunc(result);
  }

   checklocal(value){
    if(localStorage.getItem(value)==undefined)
    return false;
    else return true;

  }

   product_details(productId){
    this.filterService.prod_details=1;
    this.filterService.prod_results = productId;
    this.filterService.prod_data=productId;
    //console.log(this.filterService.prod_data.shippinginf);
    
  }
  get filterService(){
    return this.filterservice;
  }
}


