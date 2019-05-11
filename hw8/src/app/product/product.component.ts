import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import { FilterService } from '../filter.service';

import { trigger,state,style,animate,transition,query,group } from '@angular/animations';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  animations: [
    trigger('sliding', [
      transition('0 => 1', [
        query(':enter, :leave', [
          style({position: 'absolute',top: 0,left: 0,width: '100%'})
        ]),
        group([
          query(':enter', [
            style({ transform: 'translateX(-100%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(100%)' }))
          ], { optional: true })
        ])
      ]),
      transition('1 => 0', [
        query(':enter, :leave', [
          style({position: 'absolute',top: 0,left: 0,width: '100%'})
        ]),
        group([
          query(':enter', [
            style({ transform: 'translateX(-100%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(100%)' }))
          ], { optional: true })
        ])
      ])
    ])
  ]
})
export class ProductComponent implements OnInit {
  options: string[] = ['90007','90008','90009'];
  filteredOptions: Observable<any[]>;
  ebayResults: any[];
  json_err;
  json_data;
  ProductForm: FormGroup;
  ziphere;
  progress;
  activeTab;
  
  constructor(private filterservice: FilterService) { }

  ngOnInit() {
    this.activeTab = 0;
    this.filterService.prod_details = 0;
    this.ziphere='';
    this.json_err='';
    this.ebayResults=[];
    this.ProductForm = new FormGroup({
      'keyword': new FormControl("",[Validators.required,Validators.pattern(/^\s*\S.*$/)]),
      'category': new FormControl("all",),
      'New': new FormControl("",),
      'Used': new FormControl("",),
      'Unspecified': new FormControl("",),
      'local': new FormControl("",),
      'freeshipping': new FormControl("",),
      'inputdist': new FormControl("",),
      'from': new FormControl("current"),
      'otherdist': new FormControl({value:'', disabled: true},[Validators.required,Validators.pattern(/^[0-9]{5}$/)]),
    });
    
    this.filteredOptions = this.ProductForm.get('otherdist').valueChanges.pipe(
        switchMap(value => this.filterService.zipcode(value)),
      );

    this.filterService.ziphere().subscribe(value => {
      if(value!=''){
       this.ziphere = value;
      }


    });
  }

   selectTab(tabId: number) {
    this.activeTab = tabId;
  }

   ebayresults(){
    if(this.ProductForm.get('keyword').value=='') return;
    this.progress=1;
    this.json_err='';
    this.ebayResults=[];
    this.filterService.prod_details = 0;
    this.filterService.ebaysearch(this.ProductForm.get('keyword').value,this.ProductForm.get('category').value,this.ProductForm.get('New').value,this.ProductForm.get('Used').value,this.ProductForm.get('Unspecified').value,this.ProductForm.get('local').value,this.ProductForm.get('freeshipping').value,this.ProductForm.get('inputdist').value,this.ProductForm.get('otherdist').value,this.ziphere).subscribe(value => {
      this.progress=0;
      if(JSON.stringify(value)=='{}'){
        this.json_err = "No Records.";
      }
      else if(value['findItemsAdvancedResponse'][0]['ack'][0]=='Failure'){
        this.json_err = value['findItemsAdvancedResponse'][0]['errorMessage'][0]['error'][0]['message'][0];
      }
      else if(value['findItemsAdvancedResponse'][0]['searchResult'][0]['@count']==0){
        this.json_err = "No Records.";
      }
      else{
        value = value['findItemsAdvancedResponse'][0]['searchResult'][0];
        for(let i=0;i<value['item'].length;i++){
          let result= {} as any;
          if(!value['item'][i].hasOwnProperty('galleryURL')){
            result.galleryurl='N/A';
          }
          else{ result.galleryurl=value['item'][i]['galleryURL'][0];}
          if(!value['item'][i].hasOwnProperty('title')){
            result.title='N/A';
          }
          else{
            if(value['item'][i]['title'][0].length>35){
              result.fulltitle=value['item'][i]['title'][0];
              let short=result.fulltitle.substring(0,35);
              let last=short.lastIndexOf(' ');
              short=short.substring(0,last+1);
              short=short+'...';
              result.shorttitle=short;

            }
            else{
              result.fulltitle=value['item'][i]['title'][0];
              result.shorttitle=value['item'][i]['title'][0];

            }
          }
          if(!value['item'][i].hasOwnProperty('itemId')){
            result.itmId='N/A';
          }
          else{
            result.itmId=value['item'][i]['itemId'][0];
          }
          if(!value['item'][i].hasOwnProperty('returnsAccepted')){
            result.returnsaccepted='N/A';
          }
          else{
            result.returnsaccepted=value['item'][i]['returnsAccepted'][0];
          }

          if(!value['item'][i].hasOwnProperty('shippingInfo')){
            result.shippinginf='N/A';
          }
          else{
            result.shippinginf=value['item'][i]['shippingInfo'][0];
          }

          if(!value['item'][i].hasOwnProperty('sellingStatus')){
            result.price='N/A';
          }
          else{
            result.price=value['item'][i]['sellingStatus'][0]['currentPrice'][0]['__value__'];
          }
          if(!value['item'][i].hasOwnProperty('postalCode')){
            result.zip='N/A';
          }
          else{
            result.zip=value['item'][i]['postalCode'][0];
          }
          if(!value['item'][i].hasOwnProperty('shippingInfo')){
            result.shipping='N/A';
          }
          else if(value['item'][i]['shippingInfo'][0].hasOwnProperty('shippingServiceCost')){
            if(value['item'][i]['shippingInfo'][0]['shippingServiceCost'][0]['__value__']== 0.0){
              result.shipping='Free Shipping';	
            }
            else{
              result.shipping=value['item'][i]['shippingInfo'][0]['shippingServiceCost'][0]['__value__'];
            }
            
          }
          else{
            result.shipping='N/A';
          }

          if(!value['item'][i].hasOwnProperty('sellerInfo')){
            result.selleruser='N/A';
          }
          else{
            result.selleruser=value['item'][i]['sellerInfo'][0]['sellerUserName'][0];
          }
          //console.log(result);
          this.ebayResults.push(result);
      }
     
    }


  });

  }

  onSelect(data: number): void {
    this.activeTab = data;
    if(this.filterService.prod_details==1){
      this.filterService.prod_details = 0;
      if(data==0) this.ebayresults();
    }
  }

  get filterService(){
    return this.filterservice;
  }
  

}
