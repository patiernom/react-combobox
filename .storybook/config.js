import { configure } from '@storybook/react';

function loadStories() {
  require('../stories/index.js');
  require('../stories/combobox.js');

}

configure(loadStories, module);