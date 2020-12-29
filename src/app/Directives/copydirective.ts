import { Component, Directive,HostListener, ElementRef,Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';
@Directive({ selector: '[preventCutCopyPaste]' })

export class CopyDirective {
    constructor(el: ElementRef, renderer: Renderer2) {
      var events = 'cut copy paste';
      events.split(' ').forEach(e => 
      renderer.listen(el.nativeElement, e, (event) => {
        event.preventDefault();
        })
      );
    
    }
}

@Directive({
  selector: 'input[numbersOnly]'
})
export class NumberDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initalValue.replace(/[^0-9 ]*/g, '');
    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}

@Directive({
  selector: 'input[characterOnly]'
})
export class CharacterDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initalValue.replace(/[^a-zA-Z]/g, '');
    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}