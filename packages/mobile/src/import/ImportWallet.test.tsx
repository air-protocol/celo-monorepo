import mockButton from '@celo/react-components/components/Button'
import * as React from 'react'
import 'react-native'
import { fireEvent, render } from 'react-native-testing-library'
import { Provider } from 'react-redux'
import ImportWallet, { ImportWallet as ImportWalletClass } from 'src/import/ImportWallet'
import { Screens } from 'src/navigator/Screens'
import { createMockStore, getMockI18nProps } from 'test/utils'
import { mockMnemonic, mockNavigation } from 'test/values'

jest.mock('src/geth/GethAwareButton', () => {
  return mockButton
})

const mockRoute = {
  name: Screens.ImportWallet as Screens.ImportWallet,
  key: '1',
  params: {
    clean: true,
  },
}

describe('ImportWallet', () => {
  it('renders correctly and is disabled with no text', () => {
    const wrapper = render(
      <Provider store={createMockStore()}>
        <ImportWallet navigation={mockNavigation} route={mockRoute} />
      </Provider>
    )

    expect(wrapper.toJSON()).toMatchSnapshot()
    expect(wrapper.queryAllByProps({ disabled: true }).length).toBeGreaterThan(0)
  })

  it('calls import with the mnemonic', () => {
    const importFn = jest.fn()

    const wrapper = render(
      <Provider store={createMockStore()}>
        <ImportWalletClass
          importBackupPhrase={importFn}
          hideAlert={jest.fn()}
          isImportingWallet={false}
          navigation={mockNavigation}
          route={mockRoute}
          {...getMockI18nProps()}
        />
      </Provider>
    )

    fireEvent.changeText(wrapper.getByTestId('ImportWalletBackupKeyInputField'), mockMnemonic)
    fireEvent.press(wrapper.getByTestId('ImportWalletButton'))
    expect(importFn).toHaveBeenCalledWith(mockMnemonic, false)
  })
})
