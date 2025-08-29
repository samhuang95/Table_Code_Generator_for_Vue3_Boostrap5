export interface TableConfig {
  id: string
  name: string
  description?: string
  columns: ColumnConfig[]
  dataSource: DataSourceConfig
  styling: StylingConfig
  features: TableFeatures
  createdAt: Date
  updatedAt: Date
}

export interface ColumnConfig {
  id: string
  name: string
  label: string
  type: ColumnType
  width?: string | number
  sortable: boolean
  filterable: boolean
  visible: boolean
  required: boolean
  validation?: ValidationRule[]
  order: number
}

export interface DataSourceConfig {
  type: 'static' | 'api' | 'mock'
  staticData?: Record<string, any>[]
  apiUrl?: string
  apiMethod?: 'GET' | 'POST'
  apiHeaders?: Record<string, string>
  pagination?: PaginationConfig
}

export interface StylingConfig {
  theme: 'light' | 'dark' | 'custom'
  size: 'sm' | 'md' | 'lg'
  striped: boolean
  bordered: boolean
  hover: boolean
  responsive: boolean
  customCss?: string
}

export interface TableFeatures {
  search: boolean
  sorting: boolean
  filtering: boolean
  pagination: boolean
  export: boolean
  selection: SelectionConfig
}

export interface SelectionConfig {
  enabled: boolean
  mode: 'single' | 'multiple'
  showCheckbox: boolean
}

export interface PaginationConfig {
  enabled: boolean
  pageSize: number
  pageSizeOptions: number[]
  showTotal: boolean
  showSizeChanger: boolean
}

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom'
  value?: string | number
  message: string
}

export enum ColumnType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  BOOLEAN = 'boolean',
  EMAIL = 'email',
  URL = 'url',
  CUSTOM = 'custom'
}