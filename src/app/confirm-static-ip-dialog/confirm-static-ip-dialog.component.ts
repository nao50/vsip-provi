import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { VpgComponent } from '../vpg/vpg.component';
import { IpAddressMapEntry } from '../interfaces/vpg';
import { VpgService } from '../services/vpg.service';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-confirm-static-ip-dialog',
  templateUrl: './confirm-static-ip-dialog.component.html',
  styleUrls: ['./confirm-static-ip-dialog.component.scss'],
})
export class ConfirmStaticIpDialogComponent implements OnInit {
  loading = false;
  coverageType: string;
  confirmDataSource: MatTableDataSource<IpAddressMapEntry>;
  confirmDisplayedColumns: string[] = ['IMSI', 'IPAddress'];

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically(),
  });

  constructor(
    private overlay: Overlay,
    private vpgService: VpgService,
    public dialogRef: MatDialogRef<VpgComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { ip: IpAddressMapEntry[]; vpgId: string }
  ) {}

  ngOnInit(): void {
    this.coverageType = localStorage.getItem('coverageType');
    this.confirmDataSource = new MatTableDataSource(this.data.ip);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  // https://stackoverflow.com/questions/63076634/how-is-settimeout-called-in-a-for-loop-js
  upload(): void {
    this.loading = true;
    this.overlayRef.attach(new ComponentPortal(MatSpinner));
    const DELAY_BETWEEN_CALLS = 1000;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.data.ip.length; i++) {
      setTimeout(() => {
        this.vpgService
          .putVirtualPrivateGatewayIpAddressMapEntry(
            this.data.vpgId,
            this.data.ip[i],
            this.coverageType
          )
          .subscribe(
            (res) => {
              if (i === this.data.ip.length - 1) {
                this.loading = false;
                this.overlayRef.detach();
                this.dialogRef.close();
              }
            },
            (error) => {
              this.loading = false;
            }
          );
      }, DELAY_BETWEEN_CALLS * i);
    }
  }
}
