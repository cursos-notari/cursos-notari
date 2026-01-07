'use client'

import { useCallback, useReducer } from 'react'
import { Class } from '@/types/interfaces/database/class'

// types
type DialogType = 'create' | 'edit' | 'delete' | null
type DialogState = {
  type: DialogType
  isOpen: boolean
  selectedClass: Class | null
}

type DashboardState = {
  dialog: DialogState
}

type DashboardAction =
  | { type: 'OPEN_CREATE_DIALOG' }
  | { type: 'OPEN_EDIT_DIALOG'; payload: Class }
  | { type: 'OPEN_DELETE_DIALOG'; payload: Class }
  | { type: 'CLOSE_DIALOG' }

// reducer
const dashboardReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case 'OPEN_CREATE_DIALOG':
      return {
        ...state,
        dialog: {
          type: 'create',
          isOpen: true,
          selectedClass: null
        }
      }

    case 'OPEN_EDIT_DIALOG':
      return {
        ...state,
        dialog: {
          type: 'edit',
          isOpen: true,
          selectedClass: action.payload
        }
      }

    case 'OPEN_DELETE_DIALOG':
      return {
        ...state,
        dialog: {
          type: 'delete',
          isOpen: true,
          selectedClass: action.payload
        }
      }

    case 'CLOSE_DIALOG':
      return {
        ...state,
        dialog: {
          type: null,
          isOpen: false,
          selectedClass: null
        }
      }

    default: return state
  }
}

// initial state
const initialState: DashboardState = {
  dialog: {
    type: null,
    isOpen: false,
    selectedClass: null
  }
}

// hook
export function useDashboard() {

  const [state, dispatch] = useReducer(dashboardReducer, initialState)

  const openCreateDialog = useCallback(() => {
    dispatch({ type: 'OPEN_CREATE_DIALOG' })
  }, [])

  const openEditDialog = useCallback((classData: Class) => {
    dispatch({ type: 'OPEN_EDIT_DIALOG', payload: classData })
  }, [])

  const openDeleteDialog = useCallback((classData: Class) => {
    dispatch({ type: 'OPEN_DELETE_DIALOG', payload: classData })
  }, [])

  const closeDialog = useCallback(() => {
    dispatch({ type: 'CLOSE_DIALOG' })
  }, [])

  return {
    // state
    dialog: state.dialog,

    // actions
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    closeDialog,
  }
}