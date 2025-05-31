import {inject, Injectable, signal} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {jwtDecode} from 'jwt-decode';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
  role: string;
  verified: boolean;
  approved: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.authUrl;

  private isLoggedIn = signal(false);
  private currentUser = signal<any>(null);

  constructor() {
    this.checkAuthStatus();
  }

  /**
   * Verificar el estado de autenticación al cargar la aplicación
   */
  private checkAuthStatus(): void {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');

    if (token && this.isTokenValid() && userStr && userStr !== "undefined") {
      try {
        const user = JSON.parse(userStr);
        this.isLoggedIn.set(true);
        this.currentUser.set(user);
      } catch (error) {
        console.error('Error al parsear datos de usuario:', error);
        this.clearAuthData();
      }
    } else {
      this.clearAuthData();
    }
  }

  private clearAuthData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');

    this.isLoggedIn.set(false);
    this.currentUser.set(null);
  }

  /**
   * Verificar si el token JWT es válido (no ha expirado)
   */
  isTokenValid(): boolean {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;

    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      return decodedToken.exp > currentTime;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return false;
    }
  }

  /**
   * Iniciar sesión
   */
  login(loginData: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, loginData)
      .pipe(
        tap(response => this.setSession(response))
      );
  }

  /**
   * Registrar un cliente
   */
  register(registerData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, registerData)
      .pipe(
        tap(response => this.setSession(response))
      );
  }

  /**
   * Registrar un productor
   */
  registerProducer(producerData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register-producer`, producerData)
      .pipe(
        tap(response => this.setSession(response))
      );
  }

  /**
   * Guardar la sesión del usuario
   */
  setSession(authResponse: AuthResponse): void {
    localStorage.setItem('auth_token', authResponse.token);
    const userData = {
      id: authResponse.userId,
      name: authResponse.name,
      email: authResponse.email,
      role: authResponse.role,
      verified: authResponse.verified,
      approved: authResponse.approved
    };

    localStorage.setItem('auth_user', JSON.stringify(userData));

    this.isLoggedIn.set(true);
    this.currentUser.set(userData);
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');

    this.isLoggedIn.set(false);
    this.currentUser.set(null);

    this.router.navigate(['/auth/login']);
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  /**
   * Obtener el usuario actual
   */
  getCurrentUser(): any {
    return this.currentUser();
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(role: string): boolean {
    const user = this.currentUser();
    if (!user) return false;

    return user.role === `ROLE_${role}`;
  }

  /**
   * Obtener el token JWT
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}
