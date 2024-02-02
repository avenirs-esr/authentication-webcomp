import { AttributePart, noChange } from 'lit';
import { AsyncDirective, AttributePartInfo, ElementPartInfo, PartInfo, PartType } from 'lit/async-directive.js';
import { directive } from 'lit/directive.js';
import { Observable, Subscription, distinctUntilChanged, map } from 'rxjs';
import { LoggingManager, NoopLogger } from '../logging';



/**
 * Directive to handle the disable attribute based on an Observable.
 * @date 01/02/2024 - 16:12:41
 * @author A. Deman
 *
 * @class ReactiveDisableAttributeDirective
 * @typedef {ReactiveDisableAttributeDirective}
 * @extends {AsyncDirective}
 */
class ReactiveDisableAttributeDirective extends AsyncDirective {

  /** Logger for this instance. */
  private _logger = new NoopLogger();

  /** The underlying Observable. */
  private _observable: Observable<unknown> | undefined = undefined;

  /** The subscription to the observable. */
  private _subscription: Subscription | undefined = undefined;

  /** The last emitted value */
  private _value: boolean = false;

  /** The instance used to update the DOM.  */
  private _part: AttributePart | undefined = undefined;

  /**
    * Creates an instance of ReactiveDisableAttributeDirective.
    * @date 01/02/2024 - 17:09:41
    *
    * @constructor
    * @param {PartInfo} partInfo The PartInfo attached to the directive.
    */
  constructor(partInfo: PartInfo) {

    super(partInfo);
    this._logger = new LoggingManager().getLogger('ReactiveDisableAttributeDirective')

    this._logger.enter('constructor').trace('Constructor partInfo.type', partInfo.type, 'PartType.ATTRIBUTE', PartType.BOOLEAN_ATTRIBUTE).leave();

    // Checks that the partInfo instance is associated to an element.
    if (partInfo.type !== PartType.ELEMENT) {
      this._logger.fatal('The directive ReactiveDisableAttributeDirective is not used correctly. It should be applyed to an element (e.g. <button>) not to an attribute.')
      throw new Error('The directive ReactiveDisableAttributeDirective shoud be applied to an element')
    }

  }

  /**
   * Lit method.
   * @param observable The underlying observable
   * @param reverse If true the attribute disabled is true if the emitted value is false.
   */
  render(observable: Observable<unknown>, reverse: boolean) {
   
    if (this._observable !== observable) {
      this._subscription?.unsubscribe();
      this._observable = observable;
      this._subscription = observable.pipe(
        distinctUntilChanged(),
        map(value => {
          this._logger.trace('In subscription value', value, 'reverse', reverse)
          return reverse ? !value : value
        })
      ).subscribe(value => {
        this._value = !!value;
        this._logger.trace('ReactiveDisableAttributeDirective render this._value', this._value, 'value', value);
        this._updateDOM();
      });
    }

    return noChange;
  }

  /**
   * Updates the DOM.
   */
  private _updateDOM() {
    if (this.isConnected) {
      if (!this._value) {
        this._logger.enter('_updateDOM').trace('ReactiveDisableAttributeDirective remove attribute');
        this._part?.element?.removeAttribute('disabled');
      } else if (this._part?.element?.getAttribute('disabled') !== 'true') {
        const value = this._part?.element?.getAttribute('disabled')
        this._logger.trace('ReactiveDisableAttributeDirective  setAttribute disabled initial value', typeof value);
        this._logger.trace('ReactiveDisableAttributeDirective  setAttribute disabled');
        this._part?.element?.setAttribute('disabled', 'true');
      }
      this._logger.leave();

    }
  }

  /**
   * 
   * @param part The AttributePart associated to the directive that can be used to update the DOM.
   */
  update(part: AttributePart, props: Array<unknown>) {
    this._logger.enter('update').trace('ReactiveDisableAttributeDirective part', part.element);
    this._logger.trace('ReactiveDisableAttributeDirective this._value', this._value);
    this._part = part;
    this._updateDOM();
    super.update(part, props)
    this.logger.leave();
  }

  disconnected() {
    this._logger.trace('ReactiveDisableAttributeDirective disconnected')
    this._subscription?.unsubscribe();
    this._subscription = undefined;
  }

  reconnected() {
    this._logger.trace('ReactiveDisableAttributeDirective reconnected')
    this._subscription?.unsubscribe();
  }
}

export const rxDisable = directive(ReactiveDisableAttributeDirective);