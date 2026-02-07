declare module 'flutterwave-node-v3' {
  interface FlutterwaveConfig {
    public_key: string;
    secret_key: string;
  }

  interface PaymentPayload {
    tx_ref: string;
    amount: number;
    currency: string;
    redirect_url: string;
    customer: {
      email: string;
      phonenumber: string;
      name: string;
    };
    customizations?: {
      title?: string;
      description?: string;
      logo?: string;
    };
    meta?: Record<string, string>;
    payment_options?: string;
  }

  interface PaymentResponse {
    status: string;
    message: string;
    data?: {
      link?: string;
      id?: number;
      tx_ref?: string;
      flw_ref?: string;
      device_fingerprint?: string;
      amount?: number;
      currency?: string;
      charged_amount?: number;
      app_fee?: number;
      merchant_fee?: number;
      processor_response?: string;
      auth_model?: string;
      ip?: string;
      narration?: string;
      status?: string;
      payment_type?: string;
      created_at?: string;
      account_id?: number;
      customer?: {
        id: number;
        name: string;
        phone_number: string;
        email: string;
        created_at: string;
      };
    };
  }

  interface VerifyPayload {
    id: string | number;
  }

  class Payment {
    hosted(payload: PaymentPayload): Promise<PaymentResponse>;
  }

  class Transaction {
    verify(payload: VerifyPayload): Promise<PaymentResponse>;
  }

  class Flutterwave {
    Payment: Payment;
    Transaction: Transaction;

    constructor(publicKey: string, secretKey: string);
  }

  export = Flutterwave;
}
