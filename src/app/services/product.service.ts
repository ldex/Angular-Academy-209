import { Injectable } from '@angular/core';
import { Product } from '../products/product.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, delay, shareReplay, tap, map, mergeAll, first, switchAll, switchMap, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'https://storerestservice.azurewebsites.net/api/products/';
  
  private products = new BehaviorSubject<Product[]>([]);
  products$: Observable<Product[]> = this.products.asObservable();
  productsTotalNumber$: Observable<number>;
  mostExpensiveProduct$: Observable<Product>;

  constructor(private http: HttpClient) {
    this.initProduct();
    this.initMostExpensiveProduct();
    this.initProductsTotalNumber();
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + id);           
  }

  private initProductsTotalNumber() {
    this.productsTotalNumber$ = this
                                  .http
                                  .get<number>(this.baseUrl + "count")
                                  .pipe(
                                    shareReplay()
                                  );
  }  

  private initMostExpensiveProduct() {
    this.mostExpensiveProduct$ =
      this
      .products$  
      .pipe(
        filter(products => products.length != 0),
        switchMap(
          products => of(products)
                      .pipe(
                        map(products => [...products].sort((p1, p2) => p1.price > p2.price ? -1 : 1)),
                        mergeAll(),
                        first()
                      )
        )
      )
  }

  initProduct(skip: number = 0, take: number = 10) {
    let url = this.baseUrl + `?$skip=${skip}&$top=${take}&$orderby=ModifiedDate%20desc`; 

    this
      .http
      .get<Product[]>(url)
      .pipe(
        delay(1500),
        tap(console.table),
        shareReplay(),
        catchError(this.handleError)
      )
      .subscribe(
        products => {
          let currentProducts = this.products.value;
          let mergedProducts = currentProducts.concat(products);
          this.products.next(mergedProducts);
        }
      );
  }

  insertProduct(newProduct: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, newProduct);
  }

  clearList() {
    this.products.next([]);
    this.initProduct();
    this.initProductsTotalNumber();
  }

  private handleError(error: HttpErrorResponse) {
    // in a real world app, you may send the error to the server using some remote logging infrastructure
    // instead of just logging it to the console
    let errorMsg: string;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMsg = 'An error occurred:' + error.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      errorMsg = `Backend returned code ${error.status}, body was: ${error.error}`;
    }
    console.error(errorMsg);
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }

}
