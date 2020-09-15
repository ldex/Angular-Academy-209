import { Component } from '@angular/core';

@Component({
    templateUrl: './home.component.html'
})
export class HomeComponent {
    
    constructor() { 
        console.log('Before sleep');
        if (typeof Worker !== 'undefined') {
            console.time('web worker');
            // Create a new
            const worker = new Worker('./home.worker', { type: 'module' });
            worker.onmessage = ({ data }) => {
              console.log(`page got message: ${data}`);
              console.timeEnd('web worker');
            };
            worker.postMessage('hello');
          } else {
            // Web Workers are not supported in this environment.
            // You should add a fallback so that your program still executes correctly.
          }
        console.log('After sleep');
    }
}
