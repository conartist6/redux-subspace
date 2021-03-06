/**
 * Copyright 2017, IOOF Holdings Limited.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react'
import { Provider, connect } from 'react-redux'
import configureStore from 'redux-mock-store'
import { mount } from 'enzyme'

import SubspaceProvider from '../../src/components/SubspaceProvider'
import ParentSpaceProvider from '../../src/components/ParentSpaceProvider'

describe('ParentSpaceProvider Tests', () => {
    const testAction = () => ({ type: "ACTION" })
    const TestComponent = connect(
        ({ value }) => ({ value }),
        { testAction }
    )(
        ({ value, prop, testAction }) => <p>{value} - {prop}<a onClick={testAction} id="act" /></p>
    )

    it('should render child component outside of its containing subspace', () => {
        let state = {
            subState: {
                value: "wrong"
            },
            value: "expected1"
        }

        let mockStore = configureStore()(state)

        let testComponent = mount(
            <Provider store={mockStore}>
                <SubspaceProvider mapState={(state) => state.subState} namespace="PLSNO">
                    <ParentSpaceProvider>
                        <TestComponent prop="expected2" />
                    </ParentSpaceProvider>
                </SubspaceProvider>
            </Provider>
        )

        expect(testComponent.text()).to.equal("expected1 - expected2")
        testComponent.find("#act").simulate("click");

        const actions = mockStore.getActions()
        expect(actions).to.deep.equal([{ type: "ACTION" }])
    })

    it('should do nothing if there is no parent space', () => {
        let state = {
            value: "expected1"
        }

        let mockStore = configureStore()(state)

        let testComponent = mount(
            <Provider store={mockStore}>
                <ParentSpaceProvider>
                    <TestComponent prop="expected2" />
                </ParentSpaceProvider>
            </Provider>
        )

        expect(testComponent.text()).to.equal("expected1 - expected2")
        testComponent.find("#act").simulate("click");

        const actions = mockStore.getActions()
        expect(actions).to.deep.equal([{ type: "ACTION" }])
    })
})
