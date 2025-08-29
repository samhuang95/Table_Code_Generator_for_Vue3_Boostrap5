import { ref, watch } from 'vue'

export const useTheme = () => {
  const currentTheme = ref<'light' | 'dark'>('light')
  
  // 初始化主題
  const initTheme = () => {
    const savedTheme = localStorage.getItem('app-theme') as 'light' | 'dark' | null
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    
    currentTheme.value = savedTheme || systemTheme
    applyTheme(currentTheme.value)
  }
  
  // 套用主題
  const applyTheme = (theme: 'light' | 'dark') => {
    document.documentElement.setAttribute('data-theme', theme)
  }
  
  // 切換主題
  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
  }
  
  // 設定主題
  const setTheme = (theme: 'light' | 'dark') => {
    currentTheme.value = theme
  }
  
  // 監聽主題變化
  watch(currentTheme, (newTheme) => {
    applyTheme(newTheme)
    localStorage.setItem('app-theme', newTheme)
  })
  
  return {
    currentTheme,
    initTheme,
    toggleTheme,
    setTheme
  }
}