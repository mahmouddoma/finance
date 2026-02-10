import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-cursor.html',
  styleUrl: './custom-cursor.css',
})
export class CustomCursor {
  posX = signal(0);
  posY = signal(0);
  isHovering = signal(false);
  isClicking = signal(false);

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.posX.set(e.clientX);
    this.posY.set(e.clientY);

    const target = e.target as HTMLElement;
    const isClickable =
      target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.closest('a') ||
      target.closest('button') ||
      target.classList.contains('clickable') ||
      target.classList.contains('form-control') ||
      target.tagName === 'INPUT' ||
      target.tagName === 'SELECT' ||
      target.tagName === 'TEXTAREA';

    this.isHovering.set(!!isClickable);
  }

  @HostListener('document:mousedown')
  onMouseDown() {
    this.isClicking.set(true);
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isClicking.set(false);
  }
}
