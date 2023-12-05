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
      // Set the number of rows to display the entire content
      this.renderer.setAttribute(textarea, 'rows', '10'); // Adjust the number of rows as needed
    } else {
      // Set the number of rows to display 1 row
      this.renderer.setAttribute(textarea, 'rows', '1');
    }
  }
}
