
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[RestrictSpecialCharacters]'
})

export class RestrictSpecialCharacters {

    constructor(private _el: ElementRef) { }

    @HostListener('input', ['$event']) onInputChange(event: { stopPropagation: () => void; }) {
        const initalValue = this._el.nativeElement.value;
        this._el.nativeElement.value = initalValue.replace(/[^a-zA-Z0-9]*/g, '');
        if ( initalValue !== this._el.nativeElement.value) {
          event.stopPropagation();
        }
      }

}
