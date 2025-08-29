import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Template, TemplateCategory } from '@/types'

export const useTemplatesStore = defineStore('templates', () => {
  // State
  const templates = ref<Template[]>([])
  const categories = ref<TemplateCategory[]>([])
  const loading = ref(false)
  
  // Getters
  const builtInTemplates = computed(() => 
    templates.value.filter(t => t.isBuiltIn)
  )
  
  const customTemplates = computed(() =>
    templates.value.filter(t => !t.isBuiltIn)
  )
  
  const getTemplatesByCategory = computed(() => (categoryId: string) =>
    templates.value.filter(t => t.category.id === categoryId)
  )
  
  // Actions
  const loadTemplates = async () => {
    loading.value = true
    try {
      // Load from localStorage
      const savedTemplates = localStorage.getItem('custom-templates')
      if (savedTemplates) {
        const customTpls = JSON.parse(savedTemplates) as Template[]
        templates.value.push(...customTpls)
      }
      
      // Load built-in templates
      await loadBuiltInTemplates()
      
    } catch (error) {
      console.error('載入範本失敗:', error)
    } finally {
      loading.value = false
    }
  }
  
  const loadBuiltInTemplates = async () => {
    const builtInTemplates: Template[] = [
      {
        id: 'basic-table',
        name: '基礎表格',
        description: '簡單的資料展示表格',
        category: { id: 'basic', name: '基礎', description: '基礎表格範本' },
        config: {
          id: 'basic-table-config',
          name: '基礎資料表格',
          columns: [
            {
              id: 'id',
              name: 'id',
              label: 'ID',
              type: 'number' as any,
              visible: true,
              sortable: true,
              filterable: false,
              required: false,
              order: 0
            },
            {
              id: 'name',
              name: 'name',
              label: '名稱',
              type: 'text' as any,
              visible: true,
              sortable: true,
              filterable: true,
              required: true,
              order: 1
            }
          ],
          dataSource: {
            type: 'static',
            staticData: [
              { id: 1, name: '項目 1' },
              { id: 2, name: '項目 2' }
            ],
            pagination: {
              enabled: true,
              pageSize: 10,
              pageSizeOptions: [10, 20, 50],
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
            search: false,
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
        },
        isBuiltIn: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    
    templates.value.unshift(...builtInTemplates)
  }
  
  const saveTemplate = async (template: Omit<Template, 'id' | 'isBuiltIn' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate: Template = {
      ...template,
      id: crypto.randomUUID(),
      isBuiltIn: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    templates.value.push(newTemplate)
    await saveCustomTemplates()
    return newTemplate
  }
  
  const updateTemplate = async (templateId: string, updates: Partial<Template>) => {
    const templateIndex = templates.value.findIndex(t => t.id === templateId)
    if (templateIndex === -1) return false
    
    const template = templates.value[templateIndex]
    if (template.isBuiltIn) return false
    
    templates.value[templateIndex] = {
      ...template,
      ...updates,
      updatedAt: new Date()
    }
    
    await saveCustomTemplates()
    return true
  }
  
  const deleteTemplate = async (templateId: string) => {
    const templateIndex = templates.value.findIndex(t => t.id === templateId)
    if (templateIndex === -1) return false
    
    const template = templates.value[templateIndex]
    if (template.isBuiltIn) return false
    
    templates.value.splice(templateIndex, 1)
    await saveCustomTemplates()
    return true
  }
  
  const saveCustomTemplates = async () => {
    try {
      const customTpls = templates.value.filter(t => !t.isBuiltIn)
      localStorage.setItem('custom-templates', JSON.stringify(customTpls))
    } catch (error) {
      console.error('儲存自訂範本失敗:', error)
    }
  }
  
  return {
    // State
    templates,
    categories,
    loading,
    
    // Getters
    builtInTemplates,
    customTemplates,
    getTemplatesByCategory,
    
    // Actions
    loadTemplates,
    saveTemplate,
    updateTemplate,
    deleteTemplate
  }
})