export interface ProductCertificate {
  id: number;
  productId: number;
  blockchainHash: string;
  transactionHash: string;
  certificateData: string;
  createdDate: string;
  isVerified: boolean;
}

export interface CertificateData {
  productName: string;
  producerName: string;
  producerLocation: string;
  certificationDate: string;
  price: number;
  sku: string;
  localSource: boolean;
  verified: boolean;
}
