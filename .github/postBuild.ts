import { createMinifier } from 'https://deno.land/x/dts_minify@0.3.2/mod.ts'
import { build, stop } from 'https://deno.land/x/esbuild@v0.17.19/mod.js'
import * as ts from 'https://esm.sh/typescript@5.0.4?pin=v124'

// solve default export for commonjs format

await Deno.writeTextFile(
  './wrapper.cjs',
  `module.exports = require('./index.cjs').default`,
)

await build({
  entryPoints: ['./wrapper.cjs'],
  minify: true,
  bundle: true,
  format: 'cjs',
  outfile: './index.cjs',
  allowOverwrite: true,
})

await Deno.remove('./wrapper.cjs')

stop()

// minify type definitions

const minifier = createMinifier(ts)

await Deno.writeTextFile(
  'index.d.ts',
  minifier.minify(await Deno.readTextFile('index.d.ts'), { keepJsDocs: true }),
)
