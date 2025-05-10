import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-error-layout',
  imports: [RouterModule, CommonModule],
  templateUrl: './error-layout.component.html',
  standalone: true,
  styleUrl: './error-layout.component.scss'
})
export class ErrorLayoutComponent implements OnInit{
  errorCode: string = '404';
  errorMessage: string = 'Página no encontrada';
  errorDescription: string = 'Lo sentimos, la página que estás buscando no existe.';

  window = window;

  constructor(
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(
      params => {
        if (params.has('code')) {
          this.setErrorInfo(params.get('code') || '404');
        } else {
          this.route.data.subscribe(data => {
            if ( (data['errorCode'])) {
              this.setErrorInfo(data['errorCode']);
            }
          })
        }
      }
    )
  }

  private setErrorInfo(code: string) {
    this.errorCode = code;

    switch (code) {
      case '400':
        this.errorMessage = 'Solicitud incorrecta';
        this.errorDescription = 'Lo sentimos, la solicitud contiene errores de sintaxis.';
        break;
      case '401':
        this.errorMessage = 'No autorizado';
        this.errorDescription = 'No tienes autorización para acceder a este recurso.';
        break;
      case '403':
        this.errorMessage = 'Acceso prohibido';
        this.errorDescription = 'No tienes permiso para acceder a este recurso.';
        break;
      case '404':
        this.errorMessage = 'Página no encontrada';
        this.errorDescription = 'Lo sentimos, la página que estás buscando no existe.';
        break;
      case '500':
        this.errorMessage = 'Error del servidor';
        this.errorDescription = 'Ha ocurrido un error interno en el servidor.';
        break;
      case '503':
        this.errorMessage = 'Servicio no disponible';
        this.errorDescription = 'El servicio no está disponible temporalmente.';
        break;
      default:
        this.errorMessage = 'Error desconocido';
        this.errorDescription = 'Ha ocurrido un error inesperado.';
        break;
    }
  }


}
