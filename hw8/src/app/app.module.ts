import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ProductComponent } from './product/product.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { HttpClientModule } from '@angular/common/http';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ResultsComponent } from './results/results.component';
import { WishlistComponent } from './wishlist/wishlist.component';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ProdDetailsComponent } from './prod-details/prod-details.component';
import {RoundProgressModule} from 'angular-svg-round-progressbar';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    ResultsComponent,
    WishlistComponent,
    ProdDetailsComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    HttpClientModule,
    FormsModule,
    TabsModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    RoundProgressModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
