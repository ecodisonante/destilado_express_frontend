import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { minAgeValidator, passwordStregthValidator, passwordMatchValidator } from './custom-validator';

describe('Custom Validators', () => {
  
  describe('minAgeValidator', () => {
    it('should validate age correctly', () => {
      const validator = minAgeValidator(18);

      const validDateControl = new FormControl(new Date(new Date().setFullYear(new Date().getFullYear() - 20)).toISOString().substring(0, 10));
      const invalidDateControl = new FormControl(new Date(new Date().setFullYear(new Date().getFullYear() - 16)).toISOString().substring(0, 10));

      expect(validator(validDateControl)).toBeNull();
      expect(validator(invalidDateControl)).toEqual({ requiredAge: 18 });
    });
  });

  describe('passwordStregthValidator', () => {
    it('should validate password strength correctly', () => {
      const validator = passwordStregthValidator();

      const validPasswordControl = new FormControl('Valid123');
      const invalidPasswordControlShort = new FormControl('Aa1');
      const invalidPasswordControlLong = new FormControl('A'.repeat(19));
      const invalidPasswordControlWeak = new FormControl('weakpassword');

      expect(validator(validPasswordControl)).toBeNull();
      expect(validator(invalidPasswordControlShort)).toEqual({ passwordStrength: "Contraseña debe tener entre 6 y 18 caracteres" });
      expect(validator(invalidPasswordControlLong)).toEqual({ passwordStrength: "Contraseña debe tener entre 6 y 18 caracteres" });
      expect(validator(invalidPasswordControlWeak)).toEqual({ passwordStrength: "Contraseña debe tener mayúsculas, minúsculas y números" });
    });
  });

  describe('passwordMatchValidator', () => {
    it('should validate matching passwords correctly', () => {
      const formBuilder = new FormBuilder();
      const formGroup = formBuilder.group({
        passwd: ['Valid123'],
        repasswd: ['Valid123']
      }, { validators: passwordMatchValidator('passwd', 'repasswd') });

      const mismatchFormGroup = formBuilder.group({
        passwd: ['Valid123'],
        repasswd: ['Invalid123']
      }, { validators: passwordMatchValidator('passwd', 'repasswd') });

      formGroup.updateValueAndValidity();
      mismatchFormGroup.updateValueAndValidity();

      expect(formGroup.errors).toBeNull();
      expect(mismatchFormGroup.errors).toEqual({ passwordMatch: "Contraseñas no coinciden" });
    });
  });

});
