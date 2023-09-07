import {AbstractControl, ValidationErrors} from '@angular/forms';

export function menuValidator(control: AbstractControl): ValidationErrors | null {
  const selectedCategory = control.get('selectedCategory');
  const menu = control.get('menu');

  if (selectedCategory && menu) {
    if (selectedCategory.value === 'Enfant' && ['Menu enfant'].indexOf(menu.value) < 0) {
      return { 'invalidMenu': true };
    }

    if (selectedCategory.value === 'Adulte' && ['Viande', 'Poisson'].indexOf(menu.value) < 0) {
      return { 'invalidMenu': true };
    }
  }

  return null;
}

export function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  if (control.value && control.value.trim() === '') {
    return { 'whitespace': true };
  }
  return null;
}
