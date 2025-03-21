import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {}

  // --- SESSION STORAGE ---
  setSession(key: string, value: string): void {
    if (this.isBrowser()) {
      sessionStorage.setItem(key, value);
    }
  }

  getSession(key: string): string | null {
    return this.isBrowser() ? sessionStorage.getItem(key) : null;
  }

  removeSession(key: string): void {
    if (this.isBrowser()) {
      sessionStorage.removeItem(key);
    }
  }

  clearSession(): void {
    if (this.isBrowser()) {
      sessionStorage.clear();
    }
  }

  // --- LOCAL STORAGE ---
  setLocal(key: string, value: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(key, value);
    }
  }

  getLocal(key: string): string | null {
    return this.isBrowser() ? localStorage.getItem(key) : null;
  }

  removeLocal(key: string): void {
    if (this.isBrowser()) {
      localStorage.removeItem(key);
    }
  }

  clearLocal(): void {
    if (this.isBrowser()) {
      localStorage.clear();
    }
  }

  // --- Verificación de entorno seguro ---
  private isBrowser(): boolean {
    return typeof window !== 'undefined'
    && typeof document !== 'undefined'
    && typeof localStorage !== 'undefined'
    && typeof sessionStorage !== 'undefined';
  }
}
