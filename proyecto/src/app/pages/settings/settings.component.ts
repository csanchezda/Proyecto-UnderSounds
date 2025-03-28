import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  selectedOption: string = '';
  showTick: boolean = false;

  selectOption(option: string) {
    this.selectedOption = option;
    this.showTick = false;
  }

  onSettingChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    console.log('Opción seleccionada:', selectElement.value);
  }

  isSelected(option: string): boolean {
    return this.selectedOption === option;
  }

  saveSettings() {
    console.log('Guardando configuración...');
    this.showTick = true;
    setTimeout(() => {
      this.showTick = false;
    }, 2000);
  }
}