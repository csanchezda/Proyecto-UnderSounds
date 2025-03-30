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
  selectedOption: string = 'cuenta';

  selectOption(option: string) {
    this.selectedOption = option;
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
    alert('✅ Configuración guardada correctamente!');
  }
}