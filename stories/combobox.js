import React from 'react';

import { storiesOf } from '@storybook/react';
import { action, decorateAction } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';
import Combobox from '../components/combobox';

const handleOnChange = decorateAction([
  args => args.slice(0, 1)
]);

storiesOf('Combobox', module)
  .add('Simple options', () => (
    <form style={{width: '60%'}}>
      <div className={'form-group'}>
        <label htmlFor={'simpleCombobox'}>Country</label>
        <Combobox
          id={'simpleCombobox'}
          alwaysOpen
          inputClassName={'form-control'}
          onChange={action('change value')}
          placeholder={'Find'}
          inputValue={''}
          keyValueInput={false}
          options={['one', 'two', 'react', 'javascript']}
        />
      </div>
    </form>
  ))
  .add('Simple options', () => (
    <form style={{width: '60%'}}>
      <div className={'form-group'}>
        <label htmlFor={'simpleCombobox'}>Country</label>
        <Combobox
          id={'simpleCombobox'}
          alwaysOpen
          inputClassName={'form-control'}
          onChange={action('change value')}
          placeholder={'Find'}
          inputValue={''}
          keyValueInput
          options={['one', 'two', 'react', 'javascript']}
        />
      </div>
    </form>
  ));
