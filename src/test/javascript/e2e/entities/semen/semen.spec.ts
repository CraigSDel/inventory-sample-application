import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { SemenComponentsPage, SemenDeleteDialog, SemenUpdatePage } from './semen.page-object';

const expect = chai.expect;

describe('Semen e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let semenComponentsPage: SemenComponentsPage;
  let semenUpdatePage: SemenUpdatePage;
  let semenDeleteDialog: SemenDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Semen', async () => {
    await navBarPage.goToEntity('semen');
    semenComponentsPage = new SemenComponentsPage();
    await browser.wait(ec.visibilityOf(semenComponentsPage.title), 5000);
    expect(await semenComponentsPage.getTitle()).to.eq('inventorySampleApplicationApp.semen.home.title');
    await browser.wait(ec.or(ec.visibilityOf(semenComponentsPage.entities), ec.visibilityOf(semenComponentsPage.noResult)), 1000);
  });

  it('should load create Semen page', async () => {
    await semenComponentsPage.clickOnCreateButton();
    semenUpdatePage = new SemenUpdatePage();
    expect(await semenUpdatePage.getPageTitle()).to.eq('inventorySampleApplicationApp.semen.home.createOrEditLabel');
    await semenUpdatePage.cancel();
  });

  it('should create and save Semen', async () => {
    const nbButtonsBeforeCreate = await semenComponentsPage.countDeleteButtons();

    await semenComponentsPage.clickOnCreateButton();

    await promise.all([
      semenUpdatePage.setDescriptionInput('description'),
      semenUpdatePage.setReceivedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      semenUpdatePage.statusSelectLastOption(),
      semenUpdatePage.setDateAddedInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      semenUpdatePage.setLastModifiedInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      semenUpdatePage.semenDonorSelectLastOption(),
    ]);

    await semenUpdatePage.save();
    expect(await semenUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await semenComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Semen', async () => {
    const nbButtonsBeforeDelete = await semenComponentsPage.countDeleteButtons();
    await semenComponentsPage.clickOnLastDeleteButton();

    semenDeleteDialog = new SemenDeleteDialog();
    expect(await semenDeleteDialog.getDialogTitle()).to.eq('inventorySampleApplicationApp.semen.delete.question');
    await semenDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(semenComponentsPage.title), 5000);

    expect(await semenComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
