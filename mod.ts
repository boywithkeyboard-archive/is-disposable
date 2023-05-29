import blocklist from './blocklist.json' assert { type: 'json' }

let remoteBlocklist: { cached_at: number; domains: string[] } | undefined

export default async function isDisposable(
  email: string,
  { remote = false } = {},
) {
  if (/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email) === false) {
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
