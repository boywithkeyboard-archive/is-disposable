const response = await fetch(
  'https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/master/disposable_email_blocklist.conf',
)

if (!response.ok) {
  throw new Error('failed to download remote blocklist')
}

const data = await response.text()

await Deno.writeTextFile(
  './blocklist.json',
  JSON.stringify(data.split('\n').slice(0, -1)),
)
