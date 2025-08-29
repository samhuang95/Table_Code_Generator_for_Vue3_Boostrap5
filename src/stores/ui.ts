import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // State
  const sidebarVisible = ref(true)
  const currentTab = ref('configuration')
  const loading = ref(false)
  const notifications = ref<Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    createdAt: Date
  }>>([])
  
  // Actions
  const toggleSidebar = () => {
    sidebarVisible.value = !sidebarVisible.value
  }
  
  const setCurrentTab = (tab: string) => {
    currentTab.value = tab
  }
  
  const setLoading = (isLoading: boolean) => {
    loading.value = isLoading
  }
  
  const addNotification = (notification: Omit<typeof notifications.value[0], 'id' | 'createdAt'>) => {
    const newNotification = {
      ...notification,
      id: crypto.randomUUID(),
      createdAt: new Date()
    }
    
    notifications.value.push(newNotification)
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(newNotification.id)
    }, 5000)
    
    return newNotification.id
  }
  
  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }
  
  return {
    // State
    sidebarVisible,
    currentTab,
    loading,
    notifications,
    
    // Actions
    toggleSidebar,
    setCurrentTab,
    setLoading,
    addNotification,
    removeNotification
  }
})