import { Component, OnInit } from '@angular/core';
import { FilterService } from '../filter.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  constructor(private filterservice: FilterService) { }

  ngOnInit() {
  }

   wishremove(result){
    this.filterService.wishlistfunc(result);
  }

   product_details(productId){
    this.filterService.prod_details=1;
    this.filterService.prod_wishlist = productId;
    this.filterService.prod_data=productId;
    //console.log(this.filterService.prod_data.shippinginf);
    
  }

  totalshopping(){
    let sum = 0;
    for(let i=0;i<this.filterService.localwishlist.length;i++){
      sum += parseFloat(this.filterService.localwishlist[i].price);
    }
    return sum;
  }

  get filterService(){
    return this.filterservice;
  }

}
