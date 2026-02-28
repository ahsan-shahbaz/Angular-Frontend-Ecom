import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkMode.asObservable();

  initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.setDarkMode(true);
    } else {
      this.setDarkMode(false);
    }
  }

  toggleTheme() {
    this.setDarkMode(!this.isDarkMode.value);
  }

  private setDarkMode(isDark: boolean) {
    this.isDarkMode.next(isDark);
    if (isDark) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }
}
