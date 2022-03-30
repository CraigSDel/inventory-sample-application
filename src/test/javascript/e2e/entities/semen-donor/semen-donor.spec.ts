import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { SemenDonorComponentsPage, SemenDonorDeleteDialog, SemenDonorUpdatePage } from './semen-donor.page-object';

const expect = chai.expect;

describe('SemenDonor e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let semenDonorComponentsPage: SemenDonorComponentsPage;
  let semenDonorUpdatePage: SemenDonorUpdatePage;
  let semenDonorDeleteDialog: SemenDonorDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load SemenDonors', async () => {
    await navBarPage.goToEntity('semen-donor');
    semenDonorComponentsPage = new SemenDonorComponentsPage();
    await browser.wait(ec.visibilityOf(semenDonorComponentsPage.title), 5000);
    expect(await semenDonorComponentsPage.getTitle()).to.eq('inventorySampleApplicationApp.semenDonor.home.title');
    await browser.wait(ec.or(ec.visibilityOf(semenDonorComponentsPage.entities), ec.visibilityOf(semenDonorComponentsPage.noResult)), 1000);
  });

  it('should load create SemenDonor page', async () => {
    await semenDonorComponentsPage.clickOnCreateButton();
    semenDonorUpdatePage = new SemenDonorUpdatePage();
    expect(await semenDonorUpdatePage.getPageTitle()).to.eq('inventorySampleApplicationApp.semenDonor.home.createOrEditLabel');
    await semenDonorUpdatePage.cancel();
  });

  it('should create and save SemenDonors', async () => {
    const nbButtonsBeforeCreate = await semenDonorComponentsPage.countDeleteButtons();

    await semenDonorComponentsPage.clickOnCreateButton();

    await promise.all([
      semenDonorUpdatePage.getProducingInput().click(),
      semenDonorUpdatePage.setLastModifiedInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      semenDonorUpdatePage.farmSelectLastOption(),
      semenDonorUpdatePage.breedSelectLastOption(),
    ]);

    await semenDonorUpdatePage.save();
    expect(await semenDonorUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await semenDonorComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last SemenDonor', async () => {
    const nbButtonsBeforeDelete = await semenDonorComponentsPage.countDeleteButtons();
    await semenDonorComponentsPage.clickOnLastDeleteButton();

    semenDonorDeleteDialog = new SemenDonorDeleteDialog();
    expect(await semenDonorDeleteDialog.getDialogTitle()).to.eq('inventorySampleApplicationApp.semenDonor.delete.question');
    await semenDonorDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(semenDonorComponentsPage.title), 5000);

    expect(await semenDonorComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
