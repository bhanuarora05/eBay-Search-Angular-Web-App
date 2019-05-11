const express = require('express');
const app = express();
const requestLib = require('request');
const path = require('path');

app.get('', (request,response) => {
    response.redirect('/homework8');
})

app.get('/homework8', (request,response) => {
    response.sendFile(path.resolve('hw8/index.html'));
})

app.get('/zipcode', function(request,response){
    requestLib.get('http://api.geonames.org/postalCodeSearchJSON?postalcode_startsWith='+request.query['startswith']+'&username=bhanuarora05&country=US&maxRows=5', (err, res, body) => {
        if (err!=null) { response.send({}); return; }
          //console.log(body.url);
          //console.log(body.explanation);
          response.send(JSON.parse(body));
        });
        //response.send('Hello ');
});

app.get('/prodetails', function(request,response){

    //console.log(request.query['prodid']);
     let result={};
    requestLib.get('http://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=[Your App Id]&siteid=0&version=967&ItemID='+request.query['productId']+'&IncludeSelector=Description,Details,ItemSpecifics', (err, res, body) => {
           
        if (err!=null) { result.prodetails={};}
          //console.log(body.url);
          //console.log(body.explanation);
          result.prodetails=JSON.parse(body);
          if(Object.keys(result).length==3) response.send(result);
          
        });
        //response.send('Hello ');

        requestLib.get('http://svcs.ebay.com/MerchandisingService?OPERATION-NAME=getSimilarItems&SERVICE-NAME=MerchandisingService&SERVICE-VERSION=1.1.0&CONSUMER-ID=[Your App Id]&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&itemId='+request.query['productId']+'&maxResults=20', (err, res, body) => {
           
        if (err!=null) { result.simdetails={}; }
          //console.log(body.url);
          //console.log(body.explanation);
          result.simdetails=JSON.parse(body);
          if(Object.keys(result).length==3) response.send(result);
          
        });

        //console.log('https://www.googleapis.com/customsearch/v1?q='+encodeURIComponent(request.query['prodtitle'])+'&cx=005727671630136553875:wfdjaisflsa&imgSize=huge&imgType=news&num=8&searchType=image&key=AIzaSyCoI5gOBinObWbrNFSr9ftHpYJ4aCGJ2fM')
        requestLib.get('https://www.googleapis.com/customsearch/v1?q='+encodeURIComponent(request.query['prodtitle'])+'&cx=[Your Search Engine]&imgSize=huge&imgType=news&num=8&searchType=image&key=[Your Api Key]', (err, res, body) => {
           
            if (err!=null) { result.prodimages={}; }
              //console.log(body.url);
              //console.log(body.explanation);
              result.prodimages=JSON.parse(body);
              if(Object.keys(result).length==3) response.send(result);
              
            });         

});

app.get('/callapi', function(request,response){
    Url="http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=[Your App Id]&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&paginationInput.entriesPerPage=50&keywords="+request.query['keyword'];
    if(request.query['category']!='all'){
        Url+='&categoryId='+request.query['category'];
    }

    let j=0;

    if(request.query['enablenearby']=='true'){


    if(request.query['otherdist']!=''){
        Url+='&buyerPostalCode='+request.query['otherdist'];

    }
    else{
        Url+='&buyerPostalCode='+request.query['ziphere'];

    }
    if(request.query['inputdist']!=''){
        Url+='&itemFilter('+j+').name=MaxDistance&itemFilter('+j+').value='+request.query['inputdist'];
    }
    else{
        Url+='&itemFilter('+j+').name=MaxDistance&itemFilter('+j+').value=10';
    }
    j++;
  }
    if(request.query['freeshhipping']=='true'){
        Url+='&itemFilter('+j+').name=FreeShippingOnly&itemFilter('+j+').value=true';
		j++;
    }
   
    if(request.query['local']=='true'){
        Url+='&itemFilter('+j+').name=LocalPickupOnly&itemFilter('+j+').value=true';
		j++;
    }

    Url+='&itemFilter('+j+').name=HideDuplicateItems&itemFilter('+j+').value=true';
     j++;
     
     i=0;
     if(request.query['new']=='true'){
        Url+='&itemFilter('+j+').name=Condition';
        Url+='&itemFilter('+j+').value('+(i++)+')=New';
    }
    if(request.query['used']=='true'){
        Url+='&itemFilter('+j+').name=Condition';
        Url+='&itemFilter('+j+').value('+(i++)+')=Used';
    }
    if(request.query['unspecified']=='true'){
        Url+='&itemFilter('+j+').name=Condition';
        Url+='&itemFilter('+j+').value('+(i++)+')=Unspecified';
    }
    Url+='&outputSelector(0)=SellerInfo&outputSelector(1)=StoreInfo';
    console.log(Url);
    requestLib.get(Url, (err, res, body) => {
        response.setHeader('Content-Type','application/json');  
        if (err!=null) { response.send({}); return; }
          //console.log(body.url);
          //console.log(body.explanation);
          response.send(body);
        });
        //response.send('Hello ');
});

app.get('*', (request, response) => {
    response.sendFile(path.resolve("hw8/"+request.url.split("?")[0]));
});

app.listen(process.env.PORT || 8081);