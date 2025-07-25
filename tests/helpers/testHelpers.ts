import { Recipe } from "../../src/types/recipe"

export const createMockRecipe = (
    overrides: Partial<Recipe> = {}
): Omit<Recipe, "id" | "createdAt" | "updatedAt"> => ({
    name: "Test Recipe",
    ingredients: ["ingredient 1", "ingredient 2"],
    instructions: "Test instructions",
    prepTime: 30,
    ...overrides
})

export const createFullMockRecipe = (
    overrides: Partial<Recipe> = {}
): Recipe => ({
    id: "test-id",
    name: "Test Recipe",
    ingredients: ["ingredient 1", "ingredient 2"],
    instructions: "Test instructions",
    prepTime: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
})
