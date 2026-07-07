import { Component, AfterViewInit, OnDestroy, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
})
export class About implements AfterViewInit, OnDestroy {
  private observer!: IntersectionObserver;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.initAnimation();
  }

  private initAnimation(): void {
    const elements = document.querySelectorAll(
      '.about-hero, \
       .how-section, \
       .services-section, \
       .cta-section, \
       .achievement-section, \
       .testimonial-section, \
       .mission-banner, \
       .values-section, \
       .footer',
    );

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(entry.target, 'show');
          }
        });
      },

      {
        threshold: 0.15,
      },
    );

    elements.forEach((element) => {
      this.renderer.addClass(element, 'fade-up');
      this.observer.observe(element);
    });
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,

      behavior: 'smooth',
    });
  }

  scrollToSection(sectionClass: string): void {
    const section = document.querySelector(sectionClass);

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',

        block: 'start',
      });
    }
  }

  onPrimaryButtonClick(): void {
    this.scrollToSection('.services-section');
  }

  onSecondaryButtonClick(): void {
    this.scrollToSection('.how-section');
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
