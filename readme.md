## is-disposable

This library uses
[disposable-email-domains](https://github.com/disposable-email-domains/disposable-email-domains)
under the hood to check whether a email address is disposable.

### Setup

#### Deno

```ts
import isDisposable from 'https://deno.land/x/is_disposable@{VERSION}/mod.ts'
```

#### Node.js

```bash
npm i is-disposable
```

```ts
// ESM
import isDisposable from 'is-disposable'

// CommonJS
const isDisposable = require('is-disposable')
```

### Usage

```ts
// Offline Mode
console.log(await isDisposable('example@email.com')) // updated weekly

// Online Mode (RECOMMENDED)
console.log(await isDisposable('example@email.com', { remote: true })) // updated hourly
```

---

**PROTIP:** If you need a more accurate solution, I recommend to check out my upcoming cloud service
[devyl](https://devyl.net).

---
