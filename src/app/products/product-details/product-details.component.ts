import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../product.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  @Input() product: Product;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) { }

  delete() {
    if(window.confirm('Are you sure ?')) {
      this
      .productService
      .deleteProduct(this.product.id)
      .subscribe(
        () => {
          console.log("Product deleted!");
          this.productService.initProduct();
          this.router.navigateByUrl("/products");
        },
        error => console.log("Could not delete product! " + error)
      )
    }
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];

    this
      .productService
      .products$
      .pipe(
        map(products => products.find(p => p.id == id))
      )
      .subscribe(
        result => this.product = result
      )
  }

}
