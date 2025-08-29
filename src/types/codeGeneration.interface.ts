export interface GeneratedCode {
  vue: string
  typescript: string
  css?: string
  packageJson?: string
}

export interface CodeGenerationOptions {
  includeComments: boolean
  includeTypes: boolean
  includeStyles: boolean
  exportFormat: 'sfc' | 'separate'
  indentSize: number
}

export interface CodeTemplate {
  id: string
  name: string
  content: string
  variables: string[]
  type: 'vue' | 'typescript' | 'css'
}