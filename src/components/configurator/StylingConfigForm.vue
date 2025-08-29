<template>
  <div class="styling-config-form">
    <div class="form-section">
      <h5 class="form-section-title">外觀主題</h5>
      
      <div class="mb-3">
        <label class="form-label">主題風格</label>
        <div class="row">
          <div class="col-4">
            <div 
              class="theme-option"
              :class="{ active: localConfig.styling.theme === 'light' }"
              @click="localConfig.styling.theme = 'light'"
            >
              <div class="theme-preview theme-light"></div>
              <small>淺色</small>
            </div>
          </div>
          <div class="col-4">
            <div 
              class="theme-option"
              :class="{ active: localConfig.styling.theme === 'dark' }"
              @click="localConfig.styling.theme = 'dark'"
            >
              <div class="theme-preview theme-dark"></div>
              <small>深色</small>
            </div>
          </div>
          <div class="col-4">
            <div 
              class="theme-option"
              :class="{ active: localConfig.styling.theme === 'custom' }"
              @click="localConfig.styling.theme = 'custom'"
            >
              <div class="theme-preview theme-custom"></div>
              <small>自訂</small>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mb-3">
        <label class="form-label">表格大小</label>
        <select
          v-model="localConfig.styling.size"
          class="form-select"
        >
          <option value="sm">小型 (緊湊)</option>
          <option value="md">中型 (預設)</option>
          <option value="lg">大型 (寬鬆)</option>
        </select>
      </div>
    </div>
    
    <div class="form-section">
      <h5 class="form-section-title">表格樣式</h5>
      
      <div class="form-check mb-2">
        <input
          id="striped"
          v-model="localConfig.styling.striped"
          class="form-check-input"
          type="checkbox"
        />
        <label class="form-check-label" for="striped">
          斑馬紋背景 (table-striped)
        </label>
      </div>
      
      <div class="form-check mb-2">
        <input
          id="bordered"
          v-model="localConfig.styling.bordered"
          class="form-check-input"
          type="checkbox"
        />
        <label class="form-check-label" for="bordered">
          顯示邊框 (table-bordered)
        </label>
      </div>
      
      <div class="form-check mb-2">
        <input
          id="hover"
          v-model="localConfig.styling.hover"
          class="form-check-input"
          type="checkbox"
        />
        <label class="form-check-label" for="hover">
          懸停效果 (table-hover)
        </label>
      </div>
      
      <div class="form-check mb-3">
        <input
          id="responsive"
          v-model="localConfig.styling.responsive"
          class="form-check-input"
          type="checkbox"
        />
        <label class="form-check-label" for="responsive">
          響應式設計 (table-responsive)
        </label>
      </div>
    </div>
    
    <div v-if="localConfig.styling.theme === 'custom'" class="form-section">
      <h5 class="form-section-title">自訂樣式</h5>
      
      <div class="mb-3">
        <label class="form-label">自訂 CSS</label>
        <textarea
          v-model="localConfig.styling.customCss"
          class="form-control font-monospace"
          rows="8"
          placeholder="/* 在此輸入自訂 CSS 樣式 */
.my-table {
  border-radius: 8px;
}

.my-table th {
  background-color: #f8f9fa;
}"
        />
        <div class="form-text">
          可以使用 CSS 自訂表格外觀，支援所有標準 CSS 屬性
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
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

// Watch for changes and emit updates
watch(localConfig, (newConfig) => {
  emit('update', newConfig)
}, { deep: true })

// Watch props changes
watch(() => props.config, (newConfig) => {
  localConfig.value = { ...newConfig }
}, { deep: true })
</script>

<style scoped>
.theme-option {
  cursor: pointer;
  text-align: center;
  padding: 0.5rem;
  border: 2px solid transparent;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.theme-option:hover {
  border-color: var(--bs-primary);
}

.theme-option.active {
  border-color: var(--bs-primary);
  background-color: rgba(13, 110, 253, 0.1);
}

.theme-preview {
  width: 100%;
  height: 40px;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
  border: 1px solid #dee2e6;
}

.theme-light {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.theme-dark {
  background: linear-gradient(135deg, #212529 0%, #343a40 100%);
}

.theme-custom {
  background: linear-gradient(135deg, #e83e8c 0%, #6f42c1 100%);
}
</style>