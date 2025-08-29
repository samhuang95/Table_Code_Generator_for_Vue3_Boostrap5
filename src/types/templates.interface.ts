import type { TableConfig } from './configuration.interface'

export interface Template {
  id: string
  name: string
  description: string
  category: TemplateCategory
  config: TableConfig
  isBuiltIn: boolean
  createdAt: Date
  updatedAt: Date
}

export interface TemplateCategory {
  id: string
  name: string
  description: string
}

export interface TemplateExport {
  version: string
  templates: Template[]
  exportDate: Date
}