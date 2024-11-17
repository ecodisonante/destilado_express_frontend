import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Comprueba la edad del usuario a partir de la fecha de nacimiento.
 * @param minAge Edad mínima que debe tener para pasar la validación
 */
export function minAgeValidator(minAge: number): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {

        const bDate = new Date(control.value);
        let today = new Date();
        let age = today.getFullYear() - bDate.getFullYear();
        let monthDiff = today.getMonth() - bDate.getMonth();
        let dayDiff = today.getDate() - bDate.getDate();
        // comprobar si ya paso su cumpleaños del año actual
        if (monthDiff < 0 || monthDiff == 0 && dayDiff < 0) age--;

        return age < minAge ? { requiredAge: minAge } : null;
    };
}

/**
 * Comprueba que la contraseña cumpla con las medidas de seguridad.
 * - Debe tener entre 6 y 18 caracteres
 * - Debe contener mayúsculas, minúsculas y números
 * @returns 
 */
export function passwordStregthValidator() {
    var passValidator: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

    return (control: AbstractControl): ValidationErrors | null => {
        const pass: string = control.value;

        if (pass.length > 18 || pass.length < 6) return { passwordStrength: "Contraseña debe tener entre 6 y 18 caracteres" };
        else if (!passValidator.test(pass)) return { passwordStrength: "Contraseña debe tener mayúsculas, minúsculas y números" };

        return null;
    };
}


/**
 * Comprueba que las contraseñas ingresadas en el formulario coincidan.
 * @param passName 
 * @param rePassName 
 * @returns 
 */
export function passwordMatchValidator(passName: string, rePassName: string) {
    return (control: AbstractControl): ValidationErrors | null => {
        const passControl = control.get(passName);
        const rePassControl = control.get(rePassName);

        if (!passControl || !rePassControl) { return null; }

        const pass = passControl.value;
        const rePass = rePassControl.value;

        if (rePassControl.errors && !rePassControl.errors['passwordMatch']) { return null; }

        if (pass !== rePass) {
            rePassControl.setErrors({ passwordMatch: "Contraseñas no coinciden" });
            return { passwordMatch: "Contraseñas no coinciden" };
        } else {
            rePassControl.setErrors(null);
        }

        return null;
    }
}