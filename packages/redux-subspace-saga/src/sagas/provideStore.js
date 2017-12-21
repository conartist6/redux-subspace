/**
 * Copyright 2017, IOOF Holdings Limited.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { setContext } from 'redux-saga/effects'

const provideStore = (store, options) => (saga) => {
    return function* () {
        yield setContext({ store })
        yield setContext({ sagaMiddlewareOptions: options })
        yield* saga()
    }
}

export default provideStore
