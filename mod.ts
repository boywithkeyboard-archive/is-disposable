import blocklist from './blocklist.json' assert { type: 'json' }

let remoteBlocklist: { cached_at: number; domains: string[] } | undefined

export default async function isDisposable(
  email: string,
  { remote = false } = {},
) {
  const ere = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/
  if (ere.test(email) === false) {
    throw new Error('invalid email')
  }

  if (!remote) {
    return (blocklist as string[]).includes(email.split('@')[1])
  }

  if (remoteBlocklist && Date.now() - remoteBlocklist.cached_at < 3_600_000) { // update cached list every hour
    return remoteBlocklist.domains.includes(email.split('@')[1])
  }

  const response = await fetch(
    'https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/master/disposable_email_blocklist.conf',
  )

  if (!response.ok) {
    throw new Error('failed to download remote blocklist')
  }

  const data = await response.text()

  remoteBlocklist = {
    cached_at: Date.now(),
    domains: data.split('\n').slice(0, -1),
  }

  return remoteBlocklist.domains.includes(data)
}
