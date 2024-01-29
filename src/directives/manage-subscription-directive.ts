import { AsyncDirective, Part } from 'lit/async-directive.js';
import { directive } from 'lit/directive.js';
import { Observable, Subscription, distinctUntilChanged } from 'rxjs';

class ObserveDirective extends AsyncDirective {
  #subscription: Subscription | null = null;
  private _first: unknown;

  render(observable: Observable<boolean>) { 
    console.log('ObserveDirective this.render')
    this.#subscription = observable.pipe(
        distinctUntilChanged()
    ).subscribe(value => {

        console.log('ObserveDirective ICI', typeof value)
        this._first = value ? value : false;
        this.setValue(value)
       
    });
    console.log('ObserveDirective this.render xxx', this._first);
    return this._first;
  }

  
  disconnected() {
    console.log('ObserveDirective disconnected')
    this.#subscription?.unsubscribe();
  }
}

export const observe = directive(ObserveDirective);