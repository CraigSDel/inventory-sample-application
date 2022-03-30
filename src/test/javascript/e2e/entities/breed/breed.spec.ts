import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { BreedComponentsPage, BreedDeleteDialog, BreedUpdatePage } from './breed.page-object';

const expect = chai.expect;

describe('Breed e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let breedComponentsPage: BreedComponentsPage;
  let breedUpdatePage: BreedUpdatePage;
  let breedDeleteDialog: BreedDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Breeds', async () => {
    await navBarPage.goToEntity('breed');
    breedComponentsPage = new BreedComponentsPage();
    await browser.wait(ec.visibilityOf(breedComponentsPage.title), 5000);
    expect(await breedComponentsPage.getTitle()).to.eq('inventorySampleApplicationApp.breed.home.title');
    await browser.wait(ec.or(ec.visibilityOf(breedComponentsPage.entities), ec.visibilityOf(breedComponentsPage.noResult)), 1000);
  });

  it('should load create Breed page', async () => {
    await breedComponentsPage.clickOnCreateButton();
    breedUpdatePage = new BreedUpdatePage();
    expect(await breedUpdatePage.getPageTitle()).to.eq('inventorySampleApplicationApp.breed.home.createOrEditLabel');
    await breedUpdatePage.cancel();
  });

  it('should create and save Breeds', async () => {
    const nbButtonsBeforeCreate = await breedComponentsPage.countDeleteButtons();

    await breedComponentsPage.clickOnCreateButton();

    await promise.all([
      breedUpdatePage.setDescriptionInput('description'),
      breedUpdatePage.setDateAddedInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      breedUpdatePage.setLastModifiedInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
    ]);

    await breedUpdatePage.save();
    expect(await breedUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await breedComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Breed', async () => {
    const nbButtonsBeforeDelete = await breedComponentsPage.countDeleteButtons();
    await breedComponentsPage.clickOnLastDeleteButton();

    breedDeleteDialog = new BreedDeleteDialog();
    expect(await breedDeleteDialog.getDialogTitle()).to.eq('inventorySampleApplicationApp.breed.delete.question');
    await breedDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(breedComponentsPage.title), 5000);

    expect(await breedComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
