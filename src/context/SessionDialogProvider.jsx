import { useCallback, useMemo, useState } from 'react'
import SessionDialog from '../components/SessionDialog.jsx'
import { SessionDialogContext } from './sessionDialogContext.js'

// Estado da janela mockada de "Começar" / "Entrar". Não existe sessão real ainda.
export default function SessionDialogProvider({ children }) {
  const [state, setState] = useState({ open: false, mode: 'create' })

  const openDialog = useCallback((mode) => setState({ open: true, mode }), [])
  const closeDialog = useCallback(() => setState((current) => ({ ...current, open: false })), [])
  const value = useMemo(() => ({ openDialog }), [openDialog])

  return (
    <SessionDialogContext.Provider value={value}>
      {children}
      <SessionDialog
        open={state.open}
        mode={state.mode}
        onClose={closeDialog}
        onSwitch={openDialog}
      />
    </SessionDialogContext.Provider>
  )
}