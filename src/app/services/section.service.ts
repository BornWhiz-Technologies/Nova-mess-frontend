import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SectionService {
  private activeSectionSubject = new BehaviorSubject<string>('dashboard');
  activeSection$ = this.activeSectionSubject.asObservable();

  setSection(section: string) {
    this.activeSectionSubject.next(section);
  }

  getSection() {
    return this.activeSectionSubject.value;
  }
}
