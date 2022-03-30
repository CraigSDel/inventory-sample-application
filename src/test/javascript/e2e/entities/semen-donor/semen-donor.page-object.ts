import { element, by, ElementFinder } from 'protractor';

export class SemenDonorComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-semen-donor div table .btn-danger'));
  title = element.all(by.css('jhi-semen-donor div h2#page-heading span')).first();
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

export class SemenDonorUpdatePage {
  pageTitle = element(by.id('jhi-semen-donor-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  producingInput = element(by.id('field_producing'));
  lastModifiedInput = element(by.id('field_lastModified'));

  farmSelect = element(by.id('field_farm'));
  breedSelect = element(by.id('field_breed'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  getProducingInput(): ElementFinder {
    return this.producingInput;
  }

  async setLastModifiedInput(lastModified: string): Promise<void> {
    await this.lastModifiedInput.sendKeys(lastModified);
  }

  async getLastModifiedInput(): Promise<string> {
    return await this.lastModifiedInput.getAttribute('value');
  }

  async farmSelectLastOption(): Promise<void> {
    await this.farmSelect.all(by.tagName('option')).last().click();
  }

  async farmSelectOption(option: string): Promise<void> {
    await this.farmSelect.sendKeys(option);
  }

  getFarmSelect(): ElementFinder {
    return this.farmSelect;
  }

  async getFarmSelectedOption(): Promise<string> {
    return await this.farmSelect.element(by.css('option:checked')).getText();
  }

  async breedSelectLastOption(): Promise<void> {
    await this.breedSelect.all(by.tagName('option')).last().click();
  }

  async breedSelectOption(option: string): Promise<void> {
    await this.breedSelect.sendKeys(option);
  }

  getBreedSelect(): ElementFinder {
    return this.breedSelect;
  }

  async getBreedSelectedOption(): Promise<string> {
    return await this.breedSelect.element(by.css('option:checked')).getText();
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

export class SemenDonorDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-semenDonor-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-semenDonor'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
