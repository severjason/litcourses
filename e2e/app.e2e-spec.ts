import { LtcoursesPage } from './app.po';

describe('ltcourses App', () => {
  let page: LtcoursesPage;

  beforeEach(() => {
    page = new LtcoursesPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
