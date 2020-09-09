import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductInsertComponent } from './product-insert/product-insert.component';

const routes: Routes = [
  { path: 'products', component: ProductListComponent },
  { path: 'products/insert', component: ProductInsertComponent },
  { path: 'products/:id', component: ProductDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
