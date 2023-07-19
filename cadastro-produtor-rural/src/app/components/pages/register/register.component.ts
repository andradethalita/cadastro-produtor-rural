import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { validateCpfCnpj } from 'src/app/shared/validators/cpf-cnpj/validate-cpf-cnpj';
import { hectaresValidator } from 'src/app/shared/validators/hectares/validate-hectares'
import { StatesService } from 'src/app/shared/services/location/state.service';
import { CitiesService } from 'src/app/shared/services/location/cities.service';
import { RegisterService } from 'src/app/shared/services/register-services/register.service';
import { atLeastOneCheckboxSelectedValidator } from 'src/app/shared/validators/checkcox-validator/checkebox-selected-validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  form!: FormGroup;
  cpfCnpjField!: string;
  states!: string[];
  selectedState!: string;
  cities!: string[];
  farmName!: string;
  submitAttempted: boolean = false;
  plantedCropsLabels = ['Milho', 'Soja', 'Trigo', 'Algodão', 'Mandioca'];
  plantedCropsValues: string[] = [];

  constructor(
    private service: RegisterService,
    private router: Router,
    private formBuilder: FormBuilder,
    private statesService: StatesService,
    private citiesService: CitiesService
  ) {
    this.states = this.statesService.getStates();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      cpfCnpjField:['', Validators.compose([
        Validators.required,
        validateCpfCnpj
      ])],
      producerName: ['', Validators.required],
      farmName: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      farmArea:  ['', Validators.compose([
        Validators.required,
        hectaresValidator
      ])],
      arableArea: ['', Validators.compose([
        Validators.required,
        hectaresValidator
      ])],
      vegetationArea: ['', Validators.compose([
        Validators.required,
        hectaresValidator
      ])],
      plantedCrops: this.formBuilder.array([], atLeastOneCheckboxSelectedValidator)
    });
    this.form.get('state')?.setValue('');
    this.onStateChange();
    this.form.get('plantedCrops')?.valueChanges.subscribe((selectedCrops: boolean[]) => {
      this.updateSelectedPlantedCrops(selectedCrops);
      console.log(selectedCrops);

    });
      this.populatePlantedCrops();
  }

  register() {
    this.submitAttempted = true;
    console.log(this.form.value);
    if(this.form.valid){
      this.service.create(this.form.value).subscribe(() => {
        this.router.navigate(['/home'])
        console.log('cheguei');

      })
    }
  }

  cancel() {
    this.router.navigate(['/home'])
  }

  onInputChange(event: any) {
    const input = event.target as HTMLInputElement;
    const sanitizedValue = input.value.replace(/[a-zA-Z]/g, '');
    input.value = sanitizedValue;
  }

  onStateChange() {
    const selectedState = this.form.get('state')?.value;
    this.cities = this.citiesService.getCities(selectedState);
    this.form.get('city')?.setValue('');
  }

  populatePlantedCrops() {
    const plantedCropsArray = this.form.get('plantedCrops') as FormArray;
    this.plantedCropsLabels.forEach((label) => {
      plantedCropsArray.push(this.formBuilder.control(false));
    });
  }

  updateSelectedPlantedCrops(selectedCrops: boolean[]) {
    this.plantedCropsValues = [];
    selectedCrops.forEach((selected, index) => {
      if (selected) {
        this.plantedCropsValues.push(this.plantedCropsLabels[index]);
      }
    });
  }

}
