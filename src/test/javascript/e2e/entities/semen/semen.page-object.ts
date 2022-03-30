import { element, by, ElementFinder } from 'protractor';

export class SemenComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-semen div table .btn-danger'));
  title = element.all(by.css('jhi-semen div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class SemenUpdatePage {
  pageTitle = element(by.id('jhi-semen-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  receivedDateInput = element(by.id('field_receivedDate'));
  statusSelect = element(by.id('field_status'));
  lastModifiedInput = element(by.id('field_lastModified'));

  semenDonorSelect = element(by.id('field_semenDonor'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setReceivedDateInput(receivedDate: string): Promise<void> {
    await this.receivedDateInput.sendKeys(receivedDate);
  }

  async getReceivedDateInput(): Promise<string> {
    return await this.receivedDateInput.getAttribute('value');
  }

  async setStatusSelect(status: string): Promise<void> {
    await this.statusSelect.sendKeys(status);
  }

  async getStatusSelect(): Promise<string> {
    return await this.statusSelect.element(by.css('option:checked')).getText();
  }

  async statusSelectLastOption(): Promise<void> {
    await this.statusSelect.all(by.tagName('option')).last().click();
  }

  async setLastModifiedInput(lastModified: string): Promise<void> {
    await this.lastModifiedInput.sendKeys(lastModified);
  }

  async getLastModifiedInput(): Promise<string> {
    return await this.lastModifiedInput.getAttribute('value');
  }

  async semenDonorSelectLastOption(): Promise<void> {
    await this.semenDonorSelect.all(by.tagName('option')).last().click();
  }

  async semenDonorSelectOption(option: string): Promise<void> {
    await this.semenDonorSelect.sendKeys(option);
  }

  getSemenDonorSelect(): ElementFinder {
    return this.semenDonorSelect;
  }

  async getSemenDonorSelectedOption(): Promise<string> {
    return await this.semenDonorSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class SemenDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-semen-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-semen'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
