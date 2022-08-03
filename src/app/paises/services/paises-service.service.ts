import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { PaisBorder, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesServiceService {

  private baseUrl:string="https://restcountries.com/v2"
  private _regiones:string[]=["Africa", "Americas", "Asia", "Europe", "Oceania"];

  get getRegionHttpParams(){
    return new HttpParams().set("fields","name,alpha2Code");
  }

  get getPaisBorderHttpParams(){
    return new HttpParams().set("fields","name,borders");
  }

  get getPaisSimpleHttpParams(){
    return new HttpParams().set("fields","name,alpha2Code");
  }

  get regiones():string[]{
    return [...this._regiones];
  }

  constructor(
    private http:HttpClient
  ) { }

  getPaisesPorRegion(region:string):Observable<PaisSmall[] | null>{
    if(!region){
      return of(null)
    }
    const url:string=`${this.baseUrl}/region/${region}`;
    return this.http.get<PaisSmall[]>(url,{params: this.getRegionHttpParams});
  }

  getPaisesPorCodigo(codigo:string):Observable<PaisBorder | null>{
    if(!codigo){
      return of(null)
    }
    const url:string=`${this.baseUrl}/alpha/${codigo}`;
    return this.http.get<PaisBorder>(url,{params: this.getPaisBorderHttpParams});
  }

  getPaisesSimplePorCodigo(codigo:string):Observable<PaisSmall>{
    const url:string=`${this.baseUrl}/alpha/${codigo}`;
    return this.http.get<PaisSmall>(url,{params: this.getPaisSimpleHttpParams});
  }

  getPaisesPorCodigos(borders:string[]): Observable<PaisSmall[]>{
    if(!borders){
      return of([]);
    }
    const peticiones: Observable<PaisSmall>[] = []
    borders.forEach(codigo => {
      const peticion = this.getPaisesSimplePorCodigo(codigo);
      peticiones.push(peticion);
    });
    return combineLatest(peticiones);

  }

}
