import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { VirtualPrivateGateway, IpAddressMapEntry } from '../interfaces/vpg';
import { Observable, empty } from 'rxjs';
import { expand, map, reduce } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VpgService {
  constructor(private http: HttpClient) {}

  //
  getVirtualPrivateGateway(
    vpgId: string,
    coverageType: string
  ): Observable<HttpResponse<VirtualPrivateGateway>> {
    let url = '';
    if (coverageType === 'jp') {
      url = 'https://api.soracom.io/v1/virtual_private_gateways/' + `${vpgId}`;
    } else if (coverageType === 'g') {
      url =
        'https://g.api.soracom.io/v1/virtual_private_gateways/' + `${vpgId}`;
    }
    const token = localStorage.getItem('token');
    const apiKey = localStorage.getItem('apiKey');

    // return this.http.get<VirtualPrivateGateway>(url, httpOptions);
    return this.http.get<VirtualPrivateGateway>(url, {
      observe: 'response',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Soracom-Token': token,
        'X-Soracom-API-Key': apiKey,
      }),
    });
  }

  //
  listVirtualPrivateGatewayIpAddressMapEntries(
    vpgId: string,
    coverageType: string
  ): Observable<HttpResponse<IpAddressMapEntry[]>> {
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

    const getLink = (
      linkUrl?: string
    ): Observable<HttpResponse<IpAddressMapEntry[]>> => {
      if (linkUrl) {
        url = linkUrl;
      }
      return this.http.get<IpAddressMapEntry[]>(url, {
        observe: 'response',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'X-Soracom-Token': token,
          'X-Soracom-API-Key': apiKey,
        }),
      });
    };

    return getLink().pipe(
      expand((res: HttpResponse<IpAddressMapEntry[]>) => {
        if (res.headers.get('Link')) {
          const nextLink = res.headers.get('Link');
          return getLink(nextLink);
        } else {
          return empty();
        }
      })
    );
  }

  // POST /virtual_private_gateways/{vpg_id}/ip_address_map putVirtualPrivateGatewayIpAddressMapEntry
  putVirtualPrivateGatewayIpAddressMapEntry(
    vpgId: string,
    ipAddressMapEntry: IpAddressMapEntry,
    coverageType: string
  ): Observable<HttpResponse<IpAddressMapEntry>> {
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

    return this.http.post<IpAddressMapEntry>(
      url,
      JSON.stringify({
        key: ipAddressMapEntry.key,
        ipAddress: ipAddressMapEntry.ipAddress,
      }),
      {
        observe: 'response',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'X-Soracom-Token': token,
          'X-Soracom-API-Key': apiKey,
        }),
      }
    );
  }

  // DELETE /virtual_private_gateways/{vpg_id}/ip_address_map/{key} deleteVirtualPrivateGatewayIpAddressMapEntry
  deleteVirtualPrivateGatewayIpAddressMapEntry(
    vpgId: string,
    key: string,
    coverageType: string
  ): Observable<HttpResponse<{}>> {
    let url = '';
    if (coverageType === 'jp') {
      url =
        'https://api.soracom.io/v1/virtual_private_gateways/' +
        `${vpgId}` +
        '/ip_address_map/' +
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

    // return this.http.delete(url, httpOptions);
    return this.http.delete(url, {
      observe: 'response',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Soracom-Token': token,
        'X-Soracom-API-Key': apiKey,
      }),
    });
  }
}
