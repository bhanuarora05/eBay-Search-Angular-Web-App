import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  localwishlist:any[];
  constructor(private http: HttpClient) {  
    this.localwishlist = Object.keys(localStorage).map(key=>JSON.parse(localStorage.getItem(key)));
  }

prod_details: number;
prod_data:any;

prod_results = {} as any;
prod_wishlist = {} as any;

zipcode(value): Observable<any[]> {
  if(value != ''){
    let filterUrl = 'http://localhost:8081/zipcode?startswith='+value;
    return this.http.get(filterUrl).pipe(
      map(response => {
        if(response) return response['postalCodes'];
        else return ([] as any[]);
      }),
      catchError((error:any) => of([] as any[]))
    );
  }
  else{
    return of([] as any);
  }
}

prodetails(productId,title):Observable<any> {
  let prodUrl = 'http://localhost:8081/prodetails?productId='+productId+'&prodtitle='+encodeURIComponent(title);
  return this.http.get(prodUrl).pipe(
    map(response => {
      if(response) return response;
      else return ({} as any)
    }),
    catchError((error:any) => of({} as any))
  );
}

ebaysearch(keyword,category,New,Used,Unspecified,local,freeshipping,inputdist,otherdist,ziphere):Observable<any> {
  let callUrl = 'http://localhost:8081/callapi?keyword='+keyword+'&category='+category+'&new='+New+'&used='+Used+''+'&unspecified='+Unspecified+'&local='+local+'&freeshipping='+freeshipping+'&inputdist='+inputdist+'&otherdist='+otherdist+'&ziphere='+ziphere;
  return this.http.get(callUrl).pipe(
    map(response => {
      if(response) return response;
      else return ({} as any)
    }),
    catchError((error:any) => of({} as any))
  );
}

ziphere():Observable<String> {
  let Url = 'http://ip-api.com/json';
  return this.http.get(Url).pipe(
    map(response => {
      if(response) return response['zip'];
      else return ('' as String);
    }),
    catchError((error:any) => of('' as String))
  );



}

wishlistfunc(result){
  
  if(!localStorage.getItem(result.itmId)){
    localStorage.setItem(result.itmId, JSON.stringify(result));
  }
  else{
    if(this.prod_wishlist==result){
      this.prod_wishlist={}
    }
    localStorage.removeItem(result.itmId);
  }
  this.localwishlist = Object.keys(localStorage).map(key=>JSON.parse(localStorage.getItem(key)));
 


}


}
