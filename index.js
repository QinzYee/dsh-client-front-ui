/**
 * Host half of the Client Front UI bundle.
 *
 * Two of the three modules are pure browser layers (fonts and the icon rail);
 * the session-sidebar module needs the chat workspace to exist, so the Host
 * creates and registers `<home>/.dsh/chats` once. Everything else lives in the
 * Client half (`./client`).
 */
import { mkdir } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'

export const inject = ['workspaceRegistry']

export async function apply(ctx) {
  const directory = join(homedir(), '.dsh', 'chats')
  try {
    await mkdir(directory, { recursive: true })
  } catch (error) {
    console.warn('[client-front-ui] could not create the chat directory', error)
    return
  }

  const registry = ctx.workspaceRegistry
  if (registry === undefined) return
  try {
    const existing = registry.list().find((workspace) => workspace.path === directory)
    if (existing !== undefined) return
    await registry.create(directory, 'chats')
  } catch (error) {
    console.warn('[client-front-ui] could not register the chat workspace', error)
  }
}
