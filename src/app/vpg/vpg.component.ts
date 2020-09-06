import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { VirtualPrivateGateway, IpAddressMapEntry } from '../interfaces/vpg';
import { AuthService } from '../services/auth.service';
import { VpgService } from '../services/vpg.service';
import { ConfirmStaticIpDialogComponent } from '../confirm-static-ip-dialog/confirm-static-ip-dialog.component';
//
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-vpg',
  templateUrl: './vpg.component.html',
  styleUrls: ['./vpg.component.scss'],
})
export class VpgComponent implements OnInit {
  @ViewChild('fileInput') fileInput;
  errorMessage = '';
  toolbarMenuString: string;
  vpgId: string;
  coverageType: string;
  loading = false;
  // deleteLoading = false;
  deleteLoading: boolean;
  ipAddressMapEntry: IpAddressMapEntry[];
  alreadyExistsIpAddress: string[];
  virtualPrivateGateway: VirtualPrivateGateway = {};
  staticIPDataSource: MatTableDataSource<IpAddressMapEntry>;
  staticIPDisplayedColumns: string[] = [
    'IMSI',
    'IPAddress',
    'Assign',
    'Action',
  ];
  invalidChars = /^.*?(?=[\^#%&$\*:<>\?\/\{\|\}[a-zA-Z]).*$/;

  constructor(
    private authService: AuthService,
    private vpgService: VpgService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.setUsername();
    this.coverageType = localStorage.getItem('coverageType');
    this.vpgId = this.activatedRoute.snapshot.paramMap.get('vpgId');
    this.getVirtualPrivateGateway(this.vpgId);
    this.listVirtualPrivateGatewayIpAddressMapEntries(this.vpgId);
  }

  setUsername(): void {
    if (localStorage.getItem('userName')) {
      this.toolbarMenuString = localStorage.getItem('userName');
    } else {
      this.toolbarMenuString = 'MENU';
    }
  }

  getVirtualPrivateGateway(vpgId: string): void {
    this.loading = true;
    this.vpgService
      .getVirtualPrivateGateway(vpgId, this.coverageType)
      .subscribe(
        (res: VirtualPrivateGateway) => {
          this.virtualPrivateGateway = res;
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.authService.logout();
        }
      );
  }

  listVirtualPrivateGatewayIpAddressMapEntries(vpgId: string): void {
    this.loading = true;
    this.alreadyExistsIpAddress = [];
    this.ipAddressMapEntry = [];
    this.vpgService
      .listVirtualPrivateGatewayIpAddressMapEntries(vpgId, this.coverageType)
      .subscribe(
        (res: IpAddressMapEntry[]) => {
          this.ipAddressMapEntry = res;
          this.ipAddressMapEntry.filter((ipAddressMapEntry) => {
            this.alreadyExistsIpAddress.push(ipAddressMapEntry.ipAddress);
          });
          console.log('this.ipAddressMapEntry:', this.ipAddressMapEntry);
          this.staticIPDataSource = new MatTableDataSource(
            this.ipAddressMapEntry.filter((ipAddressMapEntry) => {
              return (
                ipAddressMapEntry.type === 'static' ||
                ipAddressMapEntry.type === 'dynamic'
              );
            })
          );
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.authService.logout();
        }
      );
  }

  applyFilter(filterValue: string): void {
    this.staticIPDataSource.filter = filterValue.trim().toLowerCase();
  }

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  //
  onChangeFileInput(file: File): void {
    const reader = new FileReader();
    reader.readAsText(file[0]);
    reader.onload = () => {
      const IpAddressMapEntryArray = this.csv2Object(String(reader.result));
      if (this.validationIpAddressMapEntry(IpAddressMapEntryArray)) {
        const dialogRef = this.dialog.open(ConfirmStaticIpDialogComponent, {
          width: '50rem',
          disableClose: true,
          data: { ip: IpAddressMapEntryArray, vpgId: this.vpgId },
        });
        dialogRef.afterClosed().subscribe(() => {
          this.vpgId = this.activatedRoute.snapshot.paramMap.get('vpgId');
          this.getVirtualPrivateGateway(this.vpgId);
          this.listVirtualPrivateGatewayIpAddressMapEntries(this.vpgId);
        });
      } else {
        console.log('CSV ERROR!');
      }
    };
  }

  delete(ipAddressMapEntry: IpAddressMapEntry): void {
    this.deleteLoading = true;
    this.vpgService
      .deleteVirtualPrivateGatewayIpAddressMapEntry(
        this.vpgId,
        ipAddressMapEntry.key,
        this.coverageType
      )
      .subscribe(
        (res) => {
          this.vpgId = this.activatedRoute.snapshot.paramMap.get('vpgId');
          this.getVirtualPrivateGateway(this.vpgId);
          this.listVirtualPrivateGatewayIpAddressMapEntries(this.vpgId);
          setTimeout(() => {
            this.deleteLoading = false;
          }, 3000);
        },
        (error) => {
          console.log(error);
          this.deleteLoading = false;
        }
      );
  }

  logout(): void {
    this.authService.logout();
  }

  //
  validationIpAddressMapEntry(obj: IpAddressMapEntry[]): boolean {
    this.errorMessage = '';
    const IpAddress: string[] = [];
    // NULL非許容チェック
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < obj.length; i++) {
      Object.keys(obj[i]).forEach((key) => {
        if (obj[i][key].length === 0) {
          this.errorMessage = 'Invalid NULL value.';
          return false;
        }
      });
      // IMSI の桁数チェック
      if (obj[i].key.length !== 15) {
        this.errorMessage = 'Invalid IMSI value.';
        return false;
      }
      // IP アドレスとして有効な文字列であるかチェック
      if (!this.validateIp(obj[i].ipAddress)) {
        this.errorMessage = 'Invalid IP Address.';
        return false;
      }
      // IP アドレス がデバイスサブネット内であるかチェック
      if (
        !this.includes(
          this.virtualPrivateGateway.deviceSubnetCidrRange,
          obj[i].ipAddress
        )
      ) {
        console.log('IP アドレス がデバイスサブネット内であるかチェック');
        this.errorMessage =
          'Invalid IP Address. IP address must be within the device subnet. ';
        return false;
      }
      IpAddress.push(obj[i].ipAddress);
    }
    // 入力されたIP アドレス の重複チェック
    if (this.existsSameIpAddress(IpAddress)) {
      console.log('入力されたIP アドレス の重複チェック');
      this.errorMessage =
        'Invalid IP Address. Duplicate IP addresses are not allowed.';
      return false;
    }
    // 既存アドレスとの重複チェック
    if (this.checkIsDuplicate(IpAddress, this.alreadyExistsIpAddress)) {
      this.errorMessage = 'Invalid IP Address. IP Address already exists';
      return false;
    }

    return true;
  }

  // csv to IpAddressMapEntry Object
  csv2Object(csvString: string): IpAddressMapEntry[] {
    this.errorMessage = '';
    const line = csvString.split('\r\n').filter((l) => l[0] && l[1]);
    const headers = line[0].split(',');
    const jsonArray: IpAddressMapEntry[] = [];

    if (headers[0].trim() === 'key' && headers[1].trim() === 'ipAddress') {
      for (let i = 1; i < line.length; i++) {
        const ipAddressMapEntry: IpAddressMapEntry = {};
        const body = line[i].split(',');
        ipAddressMapEntry.key = body[0];
        ipAddressMapEntry.hostId = body[0];
        ipAddressMapEntry.ipAddress = body[1];
        ipAddressMapEntry.type = 'static';
        jsonArray.push(ipAddressMapEntry);
      }
    } else if (
      headers[0].trim() === 'ipAddress' &&
      headers[1].trim() === 'key'
    ) {
      for (let i = 1; i < line.length; i++) {
        const ipAddressMapEntry: IpAddressMapEntry = {};
        const body = line[i].split(',');
        ipAddressMapEntry.ipAddress = body[0];
        ipAddressMapEntry.key = body[1];
        ipAddressMapEntry.hostId = body[1];
        ipAddressMapEntry.type = 'static';
        jsonArray.push(ipAddressMapEntry);
      }
    } else {
      this.errorMessage =
        'CSV format error. Be sure to specify key and ipAddress as csv header.';
      console.error('csv format error');
    }

    return jsonArray;
  }

  //
  existsSameIpAddress(IpAddressArray: string[]): boolean {
    const set = new Set(IpAddressArray);
    return set.size !== IpAddressArray.length;
  }

  //////////////////////////////////////////////////////////
  // https://github.com/arminhammer/node-cidr/blob/23f2044/src/index.ts
  toInt(ipAddress: string): number {
    return ipAddress
      .split('.')
      .reduce(
        (p: number, c: string, i: number) =>
          p + parseInt(c, 10) * 256 ** (3 - i),
        0
      );
  }

  address(ip: string): string {
    return ip.split('/')[0];
  }

  mask(ip: string): number {
    return parseInt(ip.split('/')[1], 10);
  }

  min(cidr: string): string {
    const addr = this.address(cidr);
    const addrInt = this.toInt(addr);
    const div = addrInt % 2 ** (32 - this.mask(cidr));
    return div > 0 ? this.toString(addrInt - div) : addr;
  }

  max(cidr: string): string {
    const initial: number = this.toInt(this.min(cidr));
    const add = 2 ** (32 - this.mask(cidr));
    return this.toString(initial + add - 1);
  }

  includes(cidr: string, ip: string): boolean {
    const ipInt = this.toInt(ip);
    return (
      ipInt >= this.toInt(this.min(cidr)) && ipInt <= this.toInt(this.max(cidr))
    );
  }

  toString(ipInt: number): string {
    let remaining = ipInt;
    const address = [];
    for (let i = 0; i < 4; i++) {
      if (remaining !== 0) {
        address.push(Math.floor(remaining / 256 ** (3 - i)));
        remaining = remaining % 256 ** (3 - i);
      } else {
        address.push(0);
      }
    }
    return address.join('.');
  }

  //
  validateIp(ip: string): boolean {
    if (this.invalidChars.test(ip)) {
      return false;
    }
    const octets = ip.split('.');
    if (octets.length !== 4) {
      return false;
    }
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < octets.length; i++) {
      const int = parseInt(octets[i], 10);
      if (isNaN(int)) {
        return false;
      }
      if (int > 255) {
        return false;
      }
    }
    return true;
  }
  //
  checkIsDuplicate(arr1, arr2): boolean {
    return (
      [...arr1, ...arr2].filter(
        (item) => arr1.includes(item) && arr2.includes(item)
      ).length > 0
    );
  }
}
