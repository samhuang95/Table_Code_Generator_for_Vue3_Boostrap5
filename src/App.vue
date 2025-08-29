<template>
  <div class="app-container">
    <!-- 側邊欄 -->
    <div class="app-sidebar" :class="{ collapsed: !uiStore.sidebarVisible }">
      <div class="sidebar-header p-3 border-bottom">
        <h4 class="mb-0">表格產生器</h4>
        <small class="text-muted">Vue3 + Bootstrap5</small>
      </div>
      
      <div class="sidebar-content p-3">
        <!-- 導航標籤 -->
        <nav class="nav nav-pills flex-column mb-3">
          <a 
            class="nav-link" 
            :class="{ active: uiStore.currentTab === 'basic' }"
            @click="uiStore.setCurrentTab('basic')"
            href="#"
          >
            <i class="bi bi-gear-fill me-2"></i>
            基礎配置
          </a>
          <a 
            class="nav-link" 
            :class="{ active: uiStore.currentTab === 'styling' }"
            @click="uiStore.setCurrentTab('styling')"
            href="#"
          >
            <i class="bi bi-palette-fill me-2"></i>
            樣式配置
          </a>
          <a 
            class="nav-link" 
            :class="{ active: uiStore.currentTab === 'columns' }"
            @click="uiStore.setCurrentTab('columns')"
            href="#"
          >
            <i class="bi bi-table me-2"></i>
            欄位管理
          </a>
          <a 
            class="nav-link" 
            :class="{ active: uiStore.currentTab === 'preview' }"
            @click="uiStore.setCurrentTab('preview')"
            href="#"
          >
            <i class="bi bi-eye-fill me-2"></i>
            預覽與匯出
          </a>
        </nav>
        
        <!-- 配置表單 -->
        <div class="config-forms">
          <BasicConfigForm 
            v-if="uiStore.currentTab === 'basic' && configStore.currentConfig"
            :config="configStore.currentConfig"
            @update="handleConfigUpdate"
          />
          
          <StylingConfigForm 
            v-if="uiStore.currentTab === 'styling' && configStore.currentConfig"
            :config="configStore.currentConfig"
            @update="handleConfigUpdate"
          />
          
          <div v-if="uiStore.currentTab === 'columns'" class="text-center py-5">
            <i class="bi bi-tools display-1 text-muted"></i>
            <h5 class="mt-3 text-muted">欄位管理功能</h5>
            <p class="text-muted">即將推出...</p>
          </div>
          
          <div v-if="uiStore.currentTab === 'preview'" class="text-center py-5">
            <i class="bi bi-code-slash display-1 text-muted"></i>
            <h5 class="mt-3 text-muted">程式碼預覽</h5>
            <p class="text-muted">即將推出...</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 主要內容區域 -->
    <div class="app-main">
      <!-- 頂部工具列 -->
      <div class="app-header">
        <button 
          class="btn btn-outline-secondary me-3"
          @click="uiStore.toggleSidebar()"
        >
          <i class="bi bi-list"></i>
        </button>
        
        <div class="d-flex align-items-center">
          <h5 class="mb-0 me-3">{{ getCurrentTabTitle() }}</h5>
          
          <div class="ms-auto d-flex align-items-center gap-2">
            <!-- 主題切換 -->
            <button 
              class="btn btn-outline-secondary btn-sm"
              @click="toggleTheme"
              :title="theme.currentTheme === 'light' ? '切換到深色主題' : '切換到淺色主題'"
            >
              <i :class="theme.currentTheme === 'light' ? 'bi bi-moon' : 'bi bi-sun'"></i>
            </button>
            
            <!-- 儲存配置 -->
            <button 
              class="btn btn-primary btn-sm"
              @click="saveCurrentConfig"
              :disabled="!configStore.currentConfig"
            >
              <i class="bi bi-save me-1"></i>
              儲存
            </button>
          </div>
        </div>
      </div>
      
      <!-- 內容區域 -->
      <div class="app-content">
        <div class="row h-100">
          <!-- 預覽區域 -->
          <div class="col-lg-8">
            <div class="table-preview h-100">
              <div v-if="!configStore.currentConfig" class="preview-placeholder">
                <div class="text-center">
                  <i class="bi bi-table display-1 text-muted"></i>
                  <h4 class="mt-3 text-muted">歡迎使用表格產生器</h4>
                  <p class="text-muted">請從左側開始配置您的表格</p>
                  <button 
                    class="btn btn-primary"
                    @click="createNewTable"
                  >
                    <i class="bi bi-plus me-2"></i>
                    建立新表格
                  </button>
                </div>
              </div>
              
              <div v-else class="preview-content">
                <h5 class="mb-3">表格預覽</h5>
                <div class="table-responsive">
                  <table class="table" :class="getTableClasses()">
                    <thead>
                      <tr>
                        <th v-for="column in visibleColumns" :key="column.id">
                          {{ column.label }}
                        </th>
                        <th v-if="!visibleColumns.length">範例欄位</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="!visibleColumns.length">
                        <td class="text-muted">請新增表格欄位</td>
                      </tr>
                      <tr v-else>
                        <td v-for="column in visibleColumns" :key="`data-${column.id}`">
                          範例資料
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 資訊面板 -->
          <div class="col-lg-4">
            <div class="card h-100">
              <div class="card-header">
                <h6 class="card-title mb-0">配置資訊</h6>
              </div>
              <div class="card-body">
                <div v-if="configStore.currentConfig">
                  <div class="mb-3">
                    <strong>表格名稱：</strong>
                    <span>{{ configStore.currentConfig.name }}</span>
                  </div>
                  
                  <div class="mb-3">
                    <strong>欄位數量：</strong>
                    <span>{{ configStore.columnCount }} 個</span>
                  </div>
                  
                  <div class="mb-3">
                    <strong>資料來源：</strong>
                    <span class="badge bg-secondary">
                      {{ getDataSourceLabel(configStore.currentConfig.dataSource.type) }}
                    </span>
                  </div>
                  
                  <div class="mb-3">
                    <strong>主題：</strong>
                    <span class="badge bg-primary">
                      {{ getThemeLabel(configStore.currentConfig.styling.theme) }}
                    </span>
                  </div>
                  
                  <div>
                    <strong>功能：</strong>
                    <div class="mt-1">
                      <span v-if="configStore.currentConfig.features.search" class="badge bg-success me-1">搜尋</span>
                      <span v-if="configStore.currentConfig.features.sorting" class="badge bg-success me-1">排序</span>
                      <span v-if="configStore.currentConfig.features.pagination" class="badge bg-success me-1">分頁</span>
                      <span v-if="configStore.currentConfig.features.export" class="badge bg-success me-1">匯出</span>
                    </div>
                  </div>
                </div>
                
                <div v-else class="text-muted text-center py-5">
                  <i class="bi bi-info-circle display-4"></i>
                  <p class="mt-2">尚未建立表格配置</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 通知訊息 -->
    <div class="position-fixed top-0 end-0 p-3" style="z-index: 11">
      <div 
        v-for="notification in uiStore.notifications" 
        :key="notification.id"
        class="toast show"
        role="alert"
      >
        <div class="toast-header">
          <i :class="getNotificationIcon(notification.type)" class="me-2"></i>
          <strong class="me-auto">{{ notification.title }}</strong>
          <button 
            type="button" 
            class="btn-close" 
            @click="uiStore.removeNotification(notification.id)"
          ></button>
        </div>
        <div class="toast-body">
          {{ notification.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useConfigurationStore } from '@/stores/configuration'
import { useUIStore } from '@/stores/ui'
import { useTheme } from '@/composables/useTheme'
import BasicConfigForm from '@/components/configurator/BasicConfigForm.vue'
import StylingConfigForm from '@/components/configurator/StylingConfigForm.vue'
import type { TableConfig } from '@/types'

// Stores
const configStore = useConfigurationStore()
const uiStore = useUIStore()
const theme = useTheme()

// Computed
const visibleColumns = computed(() => configStore.visibleColumns)

// Methods
const handleConfigUpdate = (updates: Partial<TableConfig>) => {
  configStore.updateConfig(updates)
}

const createNewTable = () => {
  configStore.createNewConfig()
  uiStore.setCurrentTab('basic')
  uiStore.addNotification({
    type: 'success',
    title: '成功',
    message: '已建立新的表格配置'
  })
}

const saveCurrentConfig = async () => {
  const success = await configStore.saveConfig()
  if (success) {
    uiStore.addNotification({
      type: 'success',
      title: '儲存成功',
      message: '表格配置已儲存'
    })
  } else {
    uiStore.addNotification({
      type: 'error',
      title: '儲存失敗',
      message: '無法儲存表格配置'
    })
  }
}

const toggleTheme = () => {
  theme.toggleTheme()
}

const getCurrentTabTitle = () => {
  const titles = {
    basic: '基礎配置',
    styling: '樣式配置',
    columns: '欄位管理',
    preview: '預覽與匯出'
  }
  return titles[uiStore.currentTab as keyof typeof titles] || '表格產生器'
}

const getTableClasses = () => {
  if (!configStore.currentConfig) return 'table-striped'
  
  const { styling } = configStore.currentConfig
  const classes = ['table']
  
  if (styling.striped) classes.push('table-striped')
  if (styling.bordered) classes.push('table-bordered')
  if (styling.hover) classes.push('table-hover')
  if (styling.size !== 'md') classes.push(`table-${styling.size}`)
  
  return classes.join(' ')
}

const getDataSourceLabel = (type: string) => {
  const labels = {
    static: '靜態資料',
    api: 'API 介面',
    mock: '模擬資料'
  }
  return labels[type as keyof typeof labels] || type
}

const getThemeLabel = (theme: string) => {
  const labels = {
    light: '淺色主題',
    dark: '深色主題',
    custom: '自訂主題'
  }
  return labels[theme as keyof typeof labels] || theme
}

const getNotificationIcon = (type: string) => {
  const icons = {
    success: 'bi bi-check-circle-fill text-success',
    error: 'bi bi-exclamation-triangle-fill text-danger',
    warning: 'bi bi-exclamation-triangle-fill text-warning',
    info: 'bi bi-info-circle-fill text-info'
  }
  return icons[type as keyof typeof icons] || 'bi bi-info-circle-fill'
}

// Lifecycle
onMounted(() => {
  theme.initTheme()
})
</script>

<style scoped>
.config-forms {
  max-height: calc(100vh - 300px);
  overflow-y: auto;
}

.nav-link {
  color: var(--bs-dark);
  cursor: pointer;
  border-radius: 0.5rem;
  margin-bottom: 0.25rem;
}

.nav-link:hover {
  background-color: var(--bs-light);
}

.nav-link.active {
  background-color: var(--bs-primary);
  color: white;
}

.sidebar-header {
  background-color: var(--bs-light);
}

.toast {
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .col-lg-4 {
    margin-top: 1rem;
  }
}
</style>