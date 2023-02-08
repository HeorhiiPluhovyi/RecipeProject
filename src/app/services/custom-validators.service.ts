import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomValidatorsService {

  constructor() { }

  isNotNumers(control: AbstractControl): ValidationErrors | null {
    return control.value.length === control.value.replace(/[0-9]/gi, '').length
      ? null
      : {'containNumber': true}
  }

  isNegativeNumber(control: AbstractControl): ValidationErrors | null {
    return control.value > 1
      ? null
      : {negativeNumber: true}
  }
}
