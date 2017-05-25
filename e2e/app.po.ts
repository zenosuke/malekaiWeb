import { browser, by, element } from 'protractor';

export class MalekaiWebPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('malekai-root h1')).getText();
  }
}
