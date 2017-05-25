import { MalekaiWebPage } from './app.po';

describe('malekai-web App', () => {
  let page: MalekaiWebPage;

  beforeEach(() => {
    page = new MalekaiWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('malekai works!');
  });
});
