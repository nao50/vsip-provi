export interface VirtualPrivateGateway {
  allowedOperators?: string[];
  createdTime?: number;
  deviceSubnetCidrRange?: string;
  fixedIpAddressesEnabled?: boolean; // インターネットの固定IP?
  gateOpened?: boolean;
  gateVxlanId?: number;
  junctionEnabled?: boolean;
  lastModifiedTime?: number;
  offsetId?: number; // ?
  operatorId?: string;
  placement?: Placement;
  primaryServiceName?: string; // string?
  redirection?: Redirection;
  size?: string;
  status?: string;
  tags?: Tags;
  type?: number; // '12', '13', '14', '15'
  ueSubnetCidrRange?: string;
  useInternetGateway?: boolean;
  virtualInterfaces?: object;
  vpcPeeringConnections?: object;
  vpgId?: string;
}

export interface Redirection {
  infrastructureProvider?: string;
  region?: string;
}

export interface Placement {
  enabled?: boolean;
  gateway?: string;
  description?: string;
}
export interface Tags {
  [key: string]: string;
}

export interface IpAddressMapEntry {
  hostId?: string;
  ipAddress?: string;
  key?: string;
  type?: string;
}
