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
import parentSpaced from '../../src/components/parentSpaced'

describe('parentSpaced Tests', () => {
    const testAction = () => ({ type: "ACTION" })
    const TestComponent = parentSpaced(connect(
        ({ value }) => ({ value }),
        { testAction }
    )(
        ({ value, prop, testAction }) => <p>{value} - {prop}<a onClick={testAction} id="act" /></p>
    ))

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
                    <TestComponent prop="expected2" />
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
                <TestComponent prop="expected2" />
            </Provider>
        )

        expect(testComponent.text()).to.equal("expected1 - expected2")
        testComponent.find("#act").simulate("click");

        const actions = mockStore.getActions()
        expect(actions).to.deep.equal([{ type: "ACTION" }])
    })

    it('should use component name in display name', () => {
        const TestComponent = () => null

        const ParentSpacedComponent = parentSpaced(TestComponent)

        expect(ParentSpacedComponent.displayName).to.equal("ParentSpaced(TestComponent)")
    })
})
