import { element, by, ElementFinder } from 'protractor';

export class FarmComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-farm div table .btn-danger'));
  title = element.all(by.css('jhi-farm div h2#page-heading span')).first();
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

export class FarmUpdatePage {
  pageTitle = element(by.id('jhi-farm-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  nameInput = element(by.id('field_name'));
  dateAddedInput = element(by.id('field_dateAdded'));
  lastModifiedInput = element(by.id('field_lastModified'));

  locationSelect = element(by.id('field_location'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setNameInput(name: string): Promise<void> {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput(): Promise<string> {
    return await this.nameInput.getAttribute('value');
  }

  async setDateAddedInput(dateAdded: string): Promise<void> {
    await this.dateAddedInput.sendKeys(dateAdded);
  }

  async getDateAddedInput(): Promise<string> {
    return await this.dateAddedInput.getAttribute('value');
  }

  async setLastModifiedInput(lastModified: string): Promise<void> {
    await this.lastModifiedInput.sendKeys(lastModified);
  }

  async getLastModifiedInput(): Promise<string> {
    return await this.lastModifiedInput.getAttribute('value');
  }

  async locationSelectLastOption(): Promise<void> {
    await this.locationSelect.all(by.tagName('option')).last().click();
  }

  async locationSelectOption(option: string): Promise<void> {
    await this.locationSelect.sendKeys(option);
  }

  getLocationSelect(): ElementFinder {
    return this.locationSelect;
  }

  async getLocationSelectedOption(): Promise<string> {
    return await this.locationSelect.element(by.css('option:checked')).getText();
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

export class FarmDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-farm-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-farm'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
