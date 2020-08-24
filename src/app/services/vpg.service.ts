import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { VirtualPrivateGateway, IpAddressMapEntry } from '../interfaces/vpg';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VpgService {
  constructor(private http: HttpClient) {}

  //
  getVirtualPrivateGateway(
    vpgId: string,
    coverageType: string
  ): Observable<VirtualPrivateGateway> {
    let url = '';
    if (coverageType === 'jp') {
      url = 'https://api.soracom.io/v1/virtual_private_gateways/' + `${vpgId}`;
    } else if (coverageType === 'g') {
      url =
        'https://g.api.soracom.io/v1/virtual_private_gateways/' + `${vpgId}`;
    }
    const token = localStorage.getItem('token');
    const apiKey = localStorage.getItem('apiKey');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Soracom-Token': token,
        'X-Soracom-API-Key': apiKey,
      }),
    };
    return this.http.get<VirtualPrivateGateway>(url, httpOptions);
  }

  //
  listVirtualPrivateGatewayIpAddressMapEntries(
    vpgId: string,
    coverageType: string
  ): Observable<IpAddressMapEntry[]> {
    let url = '';
    if (coverageType === 'jp') {
      url =
        'https://api.soracom.io/v1/virtual_private_gateways/' +
        `${vpgId}` +
        '/ip_address_map';
    } else if (coverageType === 'g') {
      url =
        'https://g.api.soracom.io/v1/virtual_private_gateways/' +
        `${vpgId}` +
        '/ip_address_map';
    }

    const token = localStorage.getItem('token');
    const apiKey = localStorage.getItem('apiKey');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Soracom-Token': token,
        'X-Soracom-API-Key': apiKey,
      }),
    };
    return this.http.get<IpAddressMapEntry[]>(url, httpOptions);
  }

  // POST /virtual_private_gateways/{vpg_id}/ip_address_map putVirtualPrivateGatewayIpAddressMapEntry
  putVirtualPrivateGatewayIpAddressMapEntry(
    vpgId: string,
    ipAddressMapEntry: IpAddressMapEntry,
    coverageType: string
  ): Observable<IpAddressMapEntry> {
    let url = '';
    if (coverageType === 'jp') {
      url =
        'https://api.soracom.io/v1/virtual_private_gateways/' +
        `${vpgId}` +
        '/ip_address_map';
    } else if (coverageType === 'g') {
      url =
        'https://g.api.soracom.io/v1/virtual_private_gateways/' +
        `${vpgId}` +
        '/ip_address_map';
    }
    const token = localStorage.getItem('token');
    const apiKey = localStorage.getItem('apiKey');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Soracom-Token': token,
        'X-Soracom-API-Key': apiKey,
      }),
    };
    return this.http.post<IpAddressMapEntry>(
      url,
      JSON.stringify({
        key: ipAddressMapEntry.key,
        ipAddress: ipAddressMapEntry.ipAddress,
      }),
      httpOptions
    );
  }

  // DELETE /virtual_private_gateways/{vpg_id}/ip_address_map/{key} deleteVirtualPrivateGatewayIpAddressMapEntry
  deleteVirtualPrivateGatewayIpAddressMapEntry(
    vpgId: string,
    key: string,
    coverageType: string
  ): Observable<{}> {
    let url = '';
    if (coverageType === 'jp') {
      url =
        'https://api.soracom.io/v1/virtual_private_gateways/' +
        `${vpgId}` +
        '/ip_address_map' +
        `${key}`;
    } else if (coverageType === 'g') {
      url =
        'https://g.api.soracom.io/v1/virtual_private_gateways/' +
        `${vpgId}` +
        '/ip_address_map' +
        `${key}`;
    }

    const token = localStorage.getItem('token');
    const apiKey = localStorage.getItem('apiKey');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Soracom-Token': token,
        'X-Soracom-API-Key': apiKey,
      }),
    };
    return this.http.delete(url, httpOptions);
  }
}
