export interface Recipe {
    id: string
    name: string
    ingredients: string[]
    instructions: string
    prepTime: number
    createdAt: Date
    updatedAt: Date
}
