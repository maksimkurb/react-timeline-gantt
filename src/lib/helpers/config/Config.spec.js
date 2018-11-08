import Config from 'libs/helpers/config/Config';

describe('Test Configuration Class', () => {
  it('It populates with defaults when no config is sent', () => {
    Config.load();
    const actualConfig = Config.values;
    expect(actualConfig.header.top.style.backgroundColor).toBe('#333333');
  });
  it('It populates with defaults when no config is sent', () => {
    const newvalues = {
      header: { top: { style: { backgroundColor: 'yellow' } } },
    };
    Config.load(newvalues);
    const actualConfig = Config.values;
    expect(actualConfig.header.top.style.backgroundColor).toBe('yellow');
    expect(actualConfig.header.middle.style.backgroundColor).toBe('chocolate');
  });
});
