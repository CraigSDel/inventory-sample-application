import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISemenDonor } from '../semen-donor.model';

import { ASC, DESC, ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { SemenDonorService } from '../service/semen-donor.service';
import { SemenDonorDeleteDialogComponent } from '../delete/semen-donor-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';

@Component({
  selector: 'jhi-semen-donor',
  templateUrl: './semen-donor.component.html',
})
export class SemenDonorComponent implements OnInit {
  semenDonors: ISemenDonor[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(protected semenDonorService: SemenDonorService, protected modalService: NgbModal, protected parseLinks: ParseLinks) {
    this.semenDonors = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  loadAll(): void {
    this.isLoading = true;

    this.semenDonorService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<ISemenDonor[]>) => {
          this.isLoading = false;
          this.paginateSemenDonors(res.body, res.headers);
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  reset(): void {
    this.page = 0;
    this.semenDonors = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISemenDonor): string {
    return item.id!;
  }

  delete(semenDonor: ISemenDonor): void {
    const modalRef = this.modalService.open(SemenDonorDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.semenDonor = semenDonor;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.reset();
      }
    });
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? ASC : DESC)];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateSemenDonors(data: ISemenDonor[] | null, headers: HttpHeaders): void {
    const linkHeader = headers.get('link');
    if (linkHeader) {
      this.links = this.parseLinks.parse(linkHeader);
    } else {
      this.links = {
        last: 0,
      };
    }
    if (data) {
      for (const d of data) {
        this.semenDonors.push(d);
      }
    }
  }
}
