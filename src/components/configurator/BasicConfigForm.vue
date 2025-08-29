<template>
  <div class="basic-config-form">
    <div class="form-section">
      <h5 class="form-section-title">基本資訊</h5>
      
      <div class="mb-3">
        <label for="tableName" class="form-label">表格名稱 *</label>
        <input
          id="tableName"
          v-model="localConfig.name"
          type="text"
          class="form-control"
          placeholder="請輸入表格名稱"
          required
        />
        <div v-if="errors.name" class="invalid-feedback d-block">
          {{ errors.name }}
        </div>
      </div>
      
      <div class="mb-3">
        <label class="form-label">表格描述</label>
        <textarea
          v-model="localConfig.description"
          class="form-control"
          rows="3"
          placeholder="選填：表格用途說明"
        />
      </div>
    </div>
    
    <div class="form-section">
      <h5 class="form-section-title">資料來源配置</h5>
      
      <div class="mb-3">
        <label class="form-label">資料來源類型</label>
        <select
          v-model="localConfig.dataSource.type"
          class="form-select"
        >
          <option value="static">靜態資料</option>
          <option value="api">API 介面</option>
          <option value="mock">模擬資料</option>
        </select>
      </div>
      
      <!-- 靜態資料配置 -->
      <div v-if="localConfig.dataSource.type === 'static'" class="mb-3">
        <label class="form-label">靜態資料 (JSON 格式)</label>
        <textarea
          v-model="staticDataJson"
          class="form-control font-monospace"
          rows="6"
          placeholder="請輸入 JSON 格式的資料"
          @input="validateStaticData"
        />
        <div v-if="errors.staticData" class="invalid-feedback d-block">
          {{ errors.staticData }}
        </div>
        <div class="form-text">
          範例：[{"name": "張三", "age": 25}, {"name": "李四", "age": 30}]
        </div>
      </div>
      
      <!-- API 配置 -->
      <div v-if="localConfig.dataSource.type === 'api'">
        <div class="mb-3">
          <label class="form-label">API URL *</label>
          <input
            v-model="localConfig.dataSource.apiUrl"
            type="url"
            class="form-control"
            placeholder="https://api.example.com/data"
            required
          />
        </div>
        
        <div class="mb-3">
          <label class="form-label">請求方法</label>
          <select
            v-model="localConfig.dataSource.apiMethod"
            class="form-select"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>
        </div>
        
        <div class="mb-3">
          <label class="form-label">請求標頭 (可選)</label>
          <textarea
            v-model="apiHeadersJson"
            class="form-control font-monospace"
            rows="3"
            placeholder='{"Authorization": "Bearer token"}'
            @input="validateApiHeaders"
          />
          <div v-if="errors.apiHeaders" class="invalid-feedback d-block">
            {{ errors.apiHeaders }}
          </div>
        </div>
      </div>
    </div>
    
    <div class="form-section">
      <h5 class="form-section-title">分頁配置</h5>
      
      <div class="form-check mb-3">
        <input
          id="enablePagination"
          v-model="localConfig.dataSource.pagination.enabled"
          class="form-check-input"
          type="checkbox"
        />
        <label class="form-check-label" for="enablePagination">
          啟用分頁功能
        </label>
      </div>
      
      <div v-if="localConfig.dataSource.pagination.enabled">
        <div class="mb-3">
          <label class="form-label">每頁顯示數量</label>
          <select
            v-model="localConfig.dataSource.pagination.pageSize"
            class="form-select"
          >
            <option :value="5">5 條</option>
            <option :value="10">10 條</option>
            <option :value="20">20 條</option>
            <option :value="50">50 條</option>
            <option :value="100">100 條</option>
          </select>
        </div>
        
        <div class="form-check mb-2">
          <input
            id="showTotal"
            v-model="localConfig.dataSource.pagination.showTotal"
            class="form-check-input"
            type="checkbox"
          />
          <label class="form-check-label" for="showTotal">
            顯示總數資訊
          </label>
        </div>
        
        <div class="form-check mb-3">
          <input
            id="showSizeChanger"
            v-model="localConfig.dataSource.pagination.showSizeChanger"
            class="form-check-input"
            type="checkbox"
          />
          <label class="form-check-label" for="showSizeChanger">
            允許切換每頁數量
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { TableConfig } from '@/types'

// Props & Emits
interface Props {
  config: TableConfig
}
const props = defineProps<Props>()
const emit = defineEmits<{
  update: [config: Partial<TableConfig>]
}>()

// Local state
const localConfig = ref<TableConfig>({ ...props.config })
const errors = ref<Record<string, string>>({})

// Computed
const staticDataJson = computed({
  get: () => JSON.stringify(localConfig.value.dataSource.staticData || [], null, 2),
  set: (value) => {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) {
        localConfig.value.dataSource.staticData = parsed
        delete errors.value.staticData
      } else {
        errors.value.staticData = '資料必須是陣列格式'
      }
    } catch {
      errors.value.staticData = 'JSON 格式錯誤'
    }
  }
})

const apiHeadersJson = computed({
  get: () => JSON.stringify(localConfig.value.dataSource.apiHeaders || {}, null, 2),
  set: (value) => {
    try {
      const parsed = JSON.parse(value || '{}')
      if (typeof parsed === 'object' && !Array.isArray(parsed)) {
        localConfig.value.dataSource.apiHeaders = parsed
        delete errors.value.apiHeaders
      } else {
        errors.value.apiHeaders = '請求標頭必須是物件格式'
      }
    } catch {
      errors.value.apiHeaders = 'JSON 格式錯誤'
    }
  }
})

// Methods
const validateStaticData = () => {
  // Validation handled in computed setter
}

const validateApiHeaders = () => {
  // Validation handled in computed setter
}

const validateForm = () => {
  errors.value = {}
  
  if (!localConfig.value.name.trim()) {
    errors.value.name = '請輸入表格名稱'
  }
  
  if (localConfig.value.dataSource.type === 'api' && !localConfig.value.dataSource.apiUrl) {
    errors.value.apiUrl = '請輸入 API URL'
  }
  
  return Object.keys(errors.value).length === 0
}

// Watch for changes and emit updates
watch(localConfig, (newConfig) => {
  if (validateForm()) {
    emit('update', newConfig)
  }
}, { deep: true })

// Watch props changes
watch(() => props.config, (newConfig) => {
  localConfig.value = { ...newConfig }
}, { deep: true })
</script>