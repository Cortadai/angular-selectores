import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs';
import { PaisSmall } from '../../interfaces/paises.interface';
import { PaisesServiceService } from '../../services/paises-service.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulatio: FormGroup=this.fb.group({
    region:["", Validators.required],
    pais:["", Validators.required],
    frontera:["", Validators.required]
  })

  // llenar selectores
  regiones: string[]=[];
  paises: PaisSmall[]=[];
  // fronteras: string[]=[];
  fronteras: PaisSmall[]=[];


  // UI
  cargando: boolean=false;

  constructor(
    private fb: FormBuilder,
    private paisesService: PaisesServiceService
  ) { }

  ngOnInit(): void {
    this.regiones=this.paisesService.regiones;

    // Cuando cambie la region
    
    // this.miFormulatio.get("region")?.valueChanges
    // .subscribe(region=>{
    //   this.paisesService.getPaisesPorRegion(region)
    //     .subscribe(paises=>{
    //       this.paises=paises;
    //     })
    // })
    this.miFormulatio.get("region")?.valueChanges
      .pipe(
        tap(() =>{
          this.miFormulatio.get("pais")?.reset("");
          this.cargando=true;
        }),
        switchMap(region=>this.paisesService.getPaisesPorRegion(region))
      )
      .subscribe(paises=>{
        this.paises=paises || [];
        this.cargando=false;
      })

    // Cuando cambie el pais
    this.miFormulatio.get("pais")?.valueChanges
    .pipe(
      tap(() =>{
        this.fronteras=[];
        this.miFormulatio.get("frontera")?.reset("");
        this.cargando=true;
      }),
      switchMap(codigo=>this.paisesService.getPaisesPorCodigo(codigo)),
      switchMap(pais=>this.paisesService.getPaisesPorCodigos(pais?.borders!))
    )
    .subscribe(paises=>{
      // this.fronteras=pais?.borders || [];
      this.fronteras=paises;
      this.cargando=false;
    })
    

  }

  aceptar(){
    console.log(this.miFormulatio.value);
  }

}
