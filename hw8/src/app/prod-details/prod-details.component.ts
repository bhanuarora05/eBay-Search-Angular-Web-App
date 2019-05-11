import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FilterService } from '../filter.service';

@Component({
  selector: 'app-prod-details',
  templateUrl: './prod-details.component.html',
  styleUrls: ['./prod-details.component.css']
})
export class ProdDetailsComponent implements OnInit {
  @Output() backevent = new EventEmitter<string>();
  json_err_prod;
  json_err_simitems;
  json_prod_data;
  json_sim_data;
  progress_prod;
  sort_arr;
  selectedValue;
  sortorder;
  json_prod_images;
  limit;
  json_err_prodimages;
  json_img_transform;
  feedback_star_lookup;
  fb;

  constructor(private filterservice: FilterService) { }

  ngOnInit() {
    this.sort_arr=[];
    this.json_img_transform=[[],[],[]];
    this.json_err_prod='';
    this.json_err_simitems='';
    this.json_prod_data='';
    this.json_sim_data='';
    this.progress_prod=1;
    this.json_prod_images='';
    this.json_err_prodimages='';
    this.fb='';
    this.feedback_star_lookup = {
      'None': ['mdi mdi-star-border mdi-lg','white'],
      'Yellow': ['mdi mdi-star-border mdi-lg','yellow'],
      'Blue': ['mdi mdi-star-border mdi-lg','blue'],
      'Turquoise': ['mdi mdi-star-border mdi-lg','turquoise'],
      'Purple': ['mdi mdi-star-border mdi-lg','purple'],
      'Red': ['mdi mdi-star-border mdi-lg','red'],
      'Green': ['mdi mdi-star-border mdi-lg','green'],
      'YellowShooting': ['mdi mdi-stars mdi-lg','yellow'],
      'TurquoiseShooting': ['mdi mdi-stars mdi-lg','turquoise'],
      'PurpleShooting': ['mdi mdi-stars mdi-lg','purple'],
      'RedShooting ': ['mdi mdi-stars mdi-lg','red'],
      'GreenShooting ': ['mdi mdi-stars mdi-lg','green'],
      'SilverShooting ': ['mdi mdi-stars mdi-lg','silver'],
    }
    this.filterService.prodetails(this.filterService.prod_data.itmId,this.filterService.prod_data.fulltitle).subscribe(value => {
      //console.log(value);
      
    this.progress_prod=0;
    this.selectedValue='default';
    this.sortorder='asc';
    this.limit=5;
   
      if(!value.hasOwnProperty('prodetails')){
        this.json_err_prod = 'No records found';
      }
      else if(JSON.stringify(value['prodetails'])=='{}'){
        this.json_err_prod = 'No records found';
        
      }
      else if(value['prodetails']['Ack']=='Failure'){
        this.json_err_prod = value['prodetails']['Errors'][0]['ShortMessage'];
 
      }
      else{
        this.json_prod_data = value['prodetails']['Item'];
        this.fb = "https://www.facebook.com/dialog/share?app_id=2280722032022712&display=popup&href=";
        this.fb += encodeURIComponent(this.json_prod_data['ViewItemURLForNaturalSearch']);
        this.fb += "&quote=Buy";
        this.fb += encodeURIComponent(" "+this.json_prod_data['Title']);
        this.fb += encodeURIComponent(" at $"+this.json_prod_data['CurrentPrice']['Value']+" from link below");
        //console.log(this.json_prod_data);
        //console.log(this.json_err_prod);
       }

      if(!value.hasOwnProperty('simdetails')){
        this.json_err_simitems = 'No Similar Item found';
      }
      else if(JSON.stringify(value['simdetails'])=='{}'){
        this.json_err_simitems = 'No Similar Item found';
      }
      else if((value['simdetails']['getSimilarItemsResponse']['itemRecommendations']['item']).length==0){
        this.json_err_simitems = 'No Similar Item found';
      }
        
      else{
        this.json_sim_data = value['simdetails']['getSimilarItemsResponse']['itemRecommendations']['item'];
        for(let i=0;i<this.json_sim_data.length;i++){
          let line=this.json_sim_data[i];
          let obj = {} as any;
          obj.default = i;
          if(line.hasOwnProperty('imageURL')) obj.img=line['imageURL'];
          if(line.hasOwnProperty('title')) obj.title=line['title'];
          if(line.hasOwnProperty('buyItNowPrice')) obj.price=parseFloat(line['buyItNowPrice']['__value__']);
          if(line.hasOwnProperty('shippingCost')) obj.shippingcost=parseFloat(line['shippingCost']['__value__']);
          if(line.hasOwnProperty('timeLeft'))obj.daysleft=parseInt(line['timeLeft'].substring(line['timeLeft'].indexOf('P')+1,line['timeLeft'].indexOf('D')));
          if(line.hasOwnProperty('viewItemURL'))obj.url=line['viewItemURL'];
          this.sort_arr.push(obj);
          

        }
        //console.log(this.sort_arr);


        //console.log(this.json_sim_data);
      }

      if(!value.hasOwnProperty('prodimages')){
        this.json_err_prodimages = 'No records';
      }
      else if(JSON.stringify(value['prodimages'])=='{}'){
        this.json_err_prodimages = 'No records';
      }
      else if(!value['prodimages'].hasOwnProperty('items')){
        this.json_err_prodimages = 'No records';
      }
      else{
          let pics = value['prodimages']['items'];
          let temp_arr = [[],[],[]];
          this.json_prod_images = [];
          for(let i=0,j=0,k=0;k<pics.length;k++){
            if(i==2 && j==0) j++;
            temp_arr[i][j++] = pics[k]['link'];
            if(j==3){
              j=0;i++;
            }
          }
          //console.log(temp_arr);
          for(let i=0,k=0;i<3;i++){
            for(let j=0;j<3;j++){
              this.json_prod_images[k++] = temp_arr[j][i];
            }
          }
          //console.log(this.json_prod_images);
      }
  

  });

  
  }

   sort_prod_details(selectedValue,sortorder){
     let sort_arr = this.sort_arr.slice();
    if(selectedValue=='default') sortorder='asc';
      sort_arr.sort(function(a,b){
        if(a[selectedValue]>b[selectedValue]) return sortorder=='asc'? 1 : -1;
        else if(a[selectedValue]<b[selectedValue]) return sortorder=='asc'? -1 : 1;
        else return 0;

      });
    return sort_arr;
  }

   button_toggle(value){
    if(value==5)this.limit=20;
    if(value>5)this.limit=5;

  }

   checklocal(value){
    if(localStorage.getItem(value)==undefined)
    return false;
    else return true;

  }
   wishadd(result){
    this.filterService.wishlistfunc(result);
  }

  get filterService(){
    return this.filterservice;
  }
}
