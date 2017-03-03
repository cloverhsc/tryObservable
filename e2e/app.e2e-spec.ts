import { TryObservablePage } from './app.po';

describe('try-observable App', () => {
  let page: TryObservablePage;

  beforeEach(() => {
    page = new TryObservablePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
