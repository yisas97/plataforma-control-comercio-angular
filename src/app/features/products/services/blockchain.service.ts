import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CertificateData, ProductCertificate} from '../model/blockchain.model';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {

  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getCertificate(productId: number): Observable<ProductCertificate> {
    return this.http.get<ProductCertificate>(`${this.apiUrl}/marketplace/${productId}/certificate`);
  }

  verifyCertificate(hash: string): Observable<{isValid: boolean, certificate?: ProductCertificate}> {
    return this.http.get<{isValid: boolean, certificate?: ProductCertificate}>(`${this.apiUrl}/certificate/verify/${hash}`);
  }

  parseCertificateData(certificateData: string): CertificateData | null {
    try {
      return JSON.parse(certificateData);
    } catch (error) {
      console.error('Error parsing certificate data:', error);
      return null;
    }
  }
}
