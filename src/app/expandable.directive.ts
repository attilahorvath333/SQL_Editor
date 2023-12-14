import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[appExpandable]',
})
export class ExpandableDirective {
  @Input() expanded: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('click') onClick() {
    this.expanded = !this.expanded;
    this.toggleTextarea();
  }
  private toggleTextarea() {
    const textarea = this.el.nativeElement;
    if (this.expanded) {
      // Set the number of rows based on the length of the textarea's value
      const numberOfRows = textarea.value.split('\n').length;
      this.renderer.setAttribute(textarea, 'rows', numberOfRows.toString());
    } else {
      // Set the number of rows to display 1 row
      this.renderer.setAttribute(textarea, 'rows', '1');
    }
  }
}
