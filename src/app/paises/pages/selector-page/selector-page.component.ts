import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { switchMap, tap } from 'rxjs/operators';

import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: [ '', Validators.required ],
    pais:   [ '', Validators.required ],
    frontera: [ '', Validators.required ],
    
  })

  //Llenar selectores
    regiones: string[]  = [];
    paises: PaisSmall[] = [];
    fronteras: string[]  = [];

    //UI
    cargando: boolean = false;

  constructor( private fb: FormBuilder,
              private paisesService: PaisesService ) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;
    
    //CUANDO CAMBIA LA REGION
    //  this.miFormulario.get( 'region' )?.valueChanges
    //  .subscribe( region => {
    //    console.log( region );

    //    this.paisesService.getPaisesPorRegion( region )
    //        .subscribe( paises => {
    //          console.log(paises);
    //          this.paises = paises
    //        })
    //  })

    this.miFormulario.get('region')?.valueChanges
    .pipe(
      tap( ( _ ) => {
        this.miFormulario.get( 'pais' )?.reset('');
        this.cargando = true;
      }),
      switchMap( region => this.paisesService.getPaisesPorRegion( region ) )
    )
    .subscribe( paises => {
      this.paises = paises;
      this.cargando = false;
    })

    //CUANDO CAMBIA EL PAIS
      this.miFormulario.get( 'pais' )?.valueChanges
        .pipe(
          tap( () =>{
            this.miFormulario.get('frontera')?.reset('');
            this.cargando = true;
          }),
          switchMap( codigo => this.paisesService.getPaisPorCodigo( codigo ))
        )

        .subscribe( pais => {
          this.fronteras = pais?.borders || [];
          this.cargando = false;
        })
  }

  guardar(){
    console.log(this.miFormulario.value);
  }

}
