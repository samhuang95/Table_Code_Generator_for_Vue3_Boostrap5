import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TableConfig, ColumnConfig } from '@/types'

export const useConfigurationStore = defineStore('configuration', () => {
  // State
  const currentConfig = ref<TableConfig | null>(null)
  const configHistory = ref<TableConfig[]>([])
  const maxHistorySize = 50
  
  // Getters
  const hasUnsavedChanges = computed(() => {
    if (!currentConfig.value) return false
    const savedVersion = localStorage.getItem(`table-config-${currentConfig.value.id}`)
    return savedVersion !== JSON.stringify(currentConfig.value)
  })
  
  const columnCount = computed(() => currentConfig.value?.columns.length ?? 0)
  
  const visibleColumns = computed(() => 
    currentConfig.value?.columns.filter(col => col.visible) ?? []
  )
  
  // Actions
  const createNewConfig = (): TableConfig => {
    const newConfig: TableConfig = {
      id: crypto.randomUUID(),
      name: '新表格配置',
      columns: [],
      dataSource: {
        type: 'static',
        staticData: [],
        pagination: {
          enabled: true,
          pageSize: 10,
          pageSizeOptions: [10, 20, 50, 100],
          showTotal: true,
          showSizeChanger: true
        }
      },
      styling: {
        theme: 'light',
        size: 'md',
        striped: true,
        bordered: true,
        hover: true,
        responsive: true
      },
      features: {
        search: true,
        sorting: true,
        filtering: false,
        pagination: true,
        export: false,
        selection: {
          enabled: false,
          mode: 'single',
          showCheckbox: false
        }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    setCurrentConfig(newConfig)
    return newConfig
  }
  
  const setCurrentConfig = (config: TableConfig) => {
    // Add to history before changing
    if (currentConfig.value) {
      addToHistory(currentConfig.value)
    }
    currentConfig.value = { ...config, updatedAt: new Date() }
  }
  
  const updateConfig = (updates: Partial<TableConfig>) => {
    if (!currentConfig.value) return
    currentConfig.value = {
      ...currentConfig.value,
      ...updates,
      updatedAt: new Date()
    }
  }
  
  const addColumn = (column: Omit<ColumnConfig, 'id' | 'order'>) => {
    if (!currentConfig.value) return
    
    const newColumn: ColumnConfig = {
      ...column,
      id: crypto.randomUUID(),
      order: currentConfig.value.columns.length
    }
    
    currentConfig.value.columns.push(newColumn)
  }
  
  const updateColumn = (columnId: string, updates: Partial<ColumnConfig>) => {
    if (!currentConfig.value) return
    
    const columnIndex = currentConfig.value.columns.findIndex(col => col.id === columnId)
    if (columnIndex === -1) return
    
    currentConfig.value.columns[columnIndex] = {
      ...currentConfig.value.columns[columnIndex],
      ...updates
    }
  }
  
  const removeColumn = (columnId: string) => {
    if (!currentConfig.value) return
    currentConfig.value.columns = currentConfig.value.columns.filter(col => col.id !== columnId)
  }
  
  const reorderColumns = (fromIndex: number, toIndex: number) => {
    if (!currentConfig.value) return
    
    const columns = [...currentConfig.value.columns]
    const [movedColumn] = columns.splice(fromIndex, 1)
    columns.splice(toIndex, 0, movedColumn)
    
    // Update order values
    columns.forEach((col, index) => {
      col.order = index
    })
    
    currentConfig.value.columns = columns
  }
  
  const saveConfig = async () => {
    if (!currentConfig.value) return
    
    try {
      const configKey = `table-config-${currentConfig.value.id}`
      localStorage.setItem(configKey, JSON.stringify(currentConfig.value))
      return true
    } catch (error) {
      console.error('儲存配置失敗:', error)
      return false
    }
  }
  
  const loadConfig = async (configId: string): Promise<boolean> => {
    try {
      const configKey = `table-config-${configId}`
      const savedConfig = localStorage.getItem(configKey)
      
      if (savedConfig) {
        const config = JSON.parse(savedConfig) as TableConfig
        setCurrentConfig(config)
        return true
      }
      return false
    } catch (error) {
      console.error('載入配置失敗:', error)
      return false
    }
  }
  
  const addToHistory = (config: TableConfig) => {
    configHistory.value.unshift({ ...config })
    if (configHistory.value.length > maxHistorySize) {
      configHistory.value = configHistory.value.slice(0, maxHistorySize)
    }
  }
  
  const undoLastChange = () => {
    if (configHistory.value.length === 0) return false
    
    const previousConfig = configHistory.value.shift()
    if (previousConfig) {
      currentConfig.value = previousConfig
      return true
    }
    return false
  }
  
  return {
    // State
    currentConfig,
    configHistory,
    
    // Getters
    hasUnsavedChanges,
    columnCount,
    visibleColumns,
    
    // Actions
    createNewConfig,
    setCurrentConfig,
    updateConfig,
    addColumn,
    updateColumn,
    removeColumn,
    reorderColumns,
    saveConfig,
    loadConfig,
    undoLastChange
  }
})