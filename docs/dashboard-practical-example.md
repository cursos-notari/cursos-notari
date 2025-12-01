# 🔍 Exemplo Prático - Fluxo em Ação

## Vamos Simular: "Usuário quer deletar uma turma"

### 📱 **1. Estado Inicial**
```typescript
// Dashboard está renderizado com:
const dashboard = useDashboard(); // Retorna:
{
  dialog: { type: null, isOpen: false, selectedClass: null },
  isPending: false,
  openCreateDialog: function,
  openEditDialog: function,
  openDeleteDialog: function,
  closeDialog: function,
  handleDelete: function
}
```

### 🖱️ **2. Usuário Clica em "Deletar"**
```typescript
// No componente MemoizedClassCard:
<ClassCardActions
  onEdit={onEdit}           // = () => openEditDialog(classItem)
  onDelete={onDelete}       // = () => openDeleteDialog(classItem) ← CLIQUE AQUI
  isPending={isPending}
/>
```

### ⚡ **3. Hook useDashboard Executa**
```typescript
// useDashboard.ts - linha ~65
const openDeleteDialog = useCallback((classData: Class) => {
  dispatch({ type: 'OPEN_DELETE_DIALOG', payload: classData })
}, [])

// dashboardReducer executa:
case 'OPEN_DELETE_DIALOG':
  return {
    ...state,
    dialog: {
      type: 'delete',          // ← MUDOU
      isOpen: true,            // ← MUDOU  
      selectedClass: classData // ← MUDOU (dados da turma clicada)
    }
  }
```

### 🎨 **4. Re-render Inteligente**
```typescript
// Dashboard detecta mudança no estado
const {
  dialog,  // ← NOVO: { type: 'delete', isOpen: true, selectedClass: turmaX }
  ...
} = useDashboard();

// Só o DialogManager re-renderiza, cards permanecem iguais (memoizados)
<DialogManager
  dialogType={dialog.type}        // 'delete'
  isOpen={dialog.isOpen}          // true
  selectedClass={dialog.selectedClass} // dados da turma
  onOpenChange={closeDialog}
  onConfirmDelete={handleDelete}
  isPending={isPending}
/>
```

### 🎭 **5. DialogManager Decide o que Renderizar**
```typescript
// dialog-manager.tsx - linha ~35
switch (dialogType) {
  case 'delete':
    if (!selectedClass) return null
    return (
      <DeleteClassDialog
        open={isOpen}                    // true
        onOpenChange={onOpenChange}      // closeDialog
        onConfirm={() => onConfirmDelete(selectedClass)} // handleDelete
        className={selectedClass.name}   // "React Avançado"
        isPending={isPending}           // false
      />
    )
}
```

### 💬 **6. Dialog Aparece na Tela**
```
┌─────────────────────────────────────┐
│        Você tem certeza absoluta?   │
│                                     │
│ Essa ação não pode ser desfeita.    │
│ Isso irá deletar permanentemente    │
│ a turma React Avançado e todos os   │
│ seus dados.                         │
│                                     │
│  [Cancelar]  [Sim, deletar turma]   │
└─────────────────────────────────────┘
```

### ✅ **7. Usuário Confirma Exclusão**
```typescript
// DeleteClassDialog - botão confirmação chama:
onClick={onConfirm} // = () => handleDelete(selectedClass)

// handleDelete no useDashboard:
const handleDelete = useCallback(async (classData: Class) => {
  const success = await deleteClass(classData) // ← useClassOperations
  if (success) {
    closeDialog() // ← Fecha o dialog
  }
}, [deleteClass, closeDialog])
```

### 🔄 **8. useClassOperations Executa**
```typescript
// use-class-operations.ts
const deleteClass = useCallback(async (classData: Class): Promise<boolean> => {
  return new Promise((resolve) => {
    startTransition(async () => { // ← isPending vira true
      try {
        const result = await deleteClassAction(classData.id) // ← API call
        
        if (result.success) {
          toast.success(`Turma "${classData.name}" deletada com sucesso!`)
          resolve(true) // ← Sucesso
        } else {
          toast.error(result.message)
          resolve(false) // ← Erro
        }
      } catch (error) {
        toast.error('Erro inesperado ao deletar turma')
        resolve(false)
      }
    })
  })
}, [])
```

### 🎉 **9. Fluxo Final**
```typescript
// Se deleteClass retornou true:
if (success) {
  closeDialog() // dispatch({ type: 'CLOSE_DIALOG' })
}

// Estado volta ao inicial:
{
  dialog: { type: null, isOpen: false, selectedClass: null },
  isPending: false
}

// Dialog desaparece
// Toast de sucesso aparece
// Lista de turmas é atualizada automaticamente (Server Actions)
```

## 🎯 **Por que isso é MUITO melhor?**

### **❌ ANTES - Problema**
```typescript
// Código todo espalhado no Dashboard:
const handleDelete = (classData: Class) => {
  startTransition(async () => {
    const result = await deleteClassAction(classData.id);
    if (result.success) {
      toast.success(`Turma "${classData.name}" deletada com sucesso!`);
      setDeleteDialogOpen(false); // ← Estado espalhado
      setDeletingClass(null);     // ← Mais estado
    } else {
      toast.error(result.message);
    }
  });
}

// Problemas:
// 1. Lógica de negócio no componente UI
// 2. Estados múltiplos e confusos
// 3. Difícil de testar
// 4. Difícil de reutilizar
```

### **✅ AGORA - Solução**
```typescript
// Responsabilidades separadas:

// 1. useDashboard → Gerencia estado dos dialogs
// 2. useClassOperations → Lógica de negócio (CRUD)
// 3. DialogManager → Renderização otimizada
// 4. MemoizedClassCard → Cards otimizados

// Benefícios:
// ✅ Cada hook tem uma responsabilidade
// ✅ Fácil de testar cada parte isoladamente
// ✅ Reutilizável em outros componentes
// ✅ Performance otimizada
// ✅ Código limpo e organizado
```

## 🧪 **Como Testar Cada Parte**

### **Teste do Hook useDashboard**
```typescript
describe('useDashboard', () => {
  it('should open delete dialog with correct class', () => {
    const { result } = renderHook(() => useDashboard());
    const mockClass = { id: '1', name: 'React Avançado' };
    
    act(() => {
      result.current.openDeleteDialog(mockClass);
    });
    
    expect(result.current.dialog).toEqual({
      type: 'delete',
      isOpen: true,
      selectedClass: mockClass
    });
  });
});
```

### **Teste do Hook useClassOperations**
```typescript
describe('useClassOperations', () => {
  it('should delete class and show success toast', async () => {
    const mockDeleteAction = jest.fn().mockResolvedValue({ success: true });
    const { result } = renderHook(() => useClassOperations());
    
    const success = await result.current.deleteClass(mockClass);
    
    expect(success).toBe(true);
    expect(mockToast.success).toHaveBeenCalledWith(
      'Turma "React Avançado" deletada com sucesso!'
    );
  });
});
```

## 🚀 **Resumo dos Benefícios**

1. **🎯 Responsabilidade Única**: Cada arquivo tem um propósito específico
2. **🔄 Estado Previsível**: useReducer torna mudanças mais claras
3. **⚡ Performance**: Memoização evita re-renders desnecessários
4. **🧪 Testabilidade**: Cada hook pode ser testado isoladamente
5. **🔧 Maintibilidade**: Mudanças ficam localizadas
6. **♻️ Reutilização**: Hooks podem ser usados em outros componentes
7. **📱 UX**: Loading states e lazy loading melhoram experiência

Agora você tem uma arquitetura sólida que escala conforme sua aplicação cresce!