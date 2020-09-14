export interface AddressInfo {
  id: string;
  address: string;
  chain: number;
  index: number;
  coin: string;
  wallet: string;
  label?: string;
  coinSpecific?: any;
  keychains?: Array<any>;
}
