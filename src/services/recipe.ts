import { Recipe } from "../types/recipe"
import { v4 as uuidv4 } from "uuid"
import fs from "fs"
import path from "path"

const DATA_PATH = path.join(__dirname, "../data/recipes.json")

const readRecipesFromFile = (): Recipe[] => {
    if (!fs.existsSync(DATA_PATH)) return []
    const data = fs.readFileSync(DATA_PATH, "utf-8")
    return JSON.parse(data || "[]") as Recipe[]
}

const writeRecipesToFile = (recipes: Recipe[]) => {
    fs.writeFileSync(DATA_PATH, JSON.stringify(recipes, null, 2))
}

export const createRecipe = (
    data: Omit<Recipe, "id" | "createdAt" | "updatedAt">
): Recipe => {
    const recipes = readRecipesFromFile()

    const newRecipe: Recipe = {
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data
    }

    recipes.push(newRecipe)
    writeRecipesToFile(recipes)
    return newRecipe
}

export const getRecipeById = (id: string): Recipe | undefined => {
    const recipes = readRecipesFromFile()
    return recipes.find((r) => r.id === id)
}

export const updateRecipe = (
    id: string,
    updates: Partial<Omit<Recipe, "id" | "createdAt">>
): Recipe | null => {
    const recipes = readRecipesFromFile()
    const index = recipes.findIndex((r) => r.id === id)
    if (index === -1) return null

    const updatedRecipe = {
        ...recipes[index],
        ...updates,
        updatedAt: new Date()
    }

    recipes[index] = updatedRecipe
    writeRecipesToFile(recipes)
    return updatedRecipe
}

export const deleteRecipe = (id: string): boolean => {
    const recipes = readRecipesFromFile()
    const newRecipes = recipes.filter((r) => r.id !== id)
    const deleted = newRecipes.length < recipes.length

    if (deleted) writeRecipesToFile(newRecipes)
    return deleted
}

export const listRecipes = (
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    order: "asc" | "desc" = "desc"
): Recipe[] => {
    let recipes = readRecipesFromFile()

    if (search) {
        const query = search.toLowerCase()
        recipes = recipes.filter(
            (r) =>
                r.name.toLowerCase().includes(query) ||
                r.ingredients.some((i) => i.toLowerCase().includes(query))
        )
    }

    recipes.sort((a, b) => {
        const aVal = a[sortBy as keyof Recipe]
        const bVal = b[sortBy as keyof Recipe]

        if (aVal instanceof Date && bVal instanceof Date) {
            return order === "asc"
                ? new Date(aVal).getTime() - new Date(bVal).getTime()
                : new Date(bVal).getTime() - new Date(aVal).getTime()
        }

        return 0
    })

    const start = (page - 1) * limit
    return recipes.slice(start, start + limit)
}
