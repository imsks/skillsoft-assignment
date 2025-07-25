import { Recipe } from "../types/recipe"
import { v4 as uuidv4 } from "uuid"
import fs from "fs"
import path from "path"

const DATA_PATH =
    process.env.NODE_ENV === "test"
        ? path.join(__dirname, "../data/test-recipes.json")
        : path.join(__dirname, "../data/recipes.json")

const readRecipesFromFile = (): Recipe[] => {
    if (!fs.existsSync(DATA_PATH)) return []
    const data = fs.readFileSync(DATA_PATH, "utf-8")
    const rawRecipes = JSON.parse(data || "[]")

    // Convert date strings back to Date objects
    return rawRecipes.map((recipe: any) => ({
        ...recipe,
        createdAt: new Date(recipe.createdAt),
        updatedAt: new Date(recipe.updatedAt)
    })) as Recipe[]
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

        // Handle Date objects and date strings
        if (
            (aVal instanceof Date || typeof aVal === "string") &&
            (bVal instanceof Date || typeof bVal === "string") &&
            (sortBy === "createdAt" || sortBy === "updatedAt")
        ) {
            const aTime =
                aVal instanceof Date
                    ? aVal.getTime()
                    : new Date(aVal as string).getTime()
            const bTime =
                bVal instanceof Date
                    ? bVal.getTime()
                    : new Date(bVal as string).getTime()

            return order === "asc" ? aTime - bTime : bTime - aTime
        }

        // Handle string sorting for name and other string fields
        if (typeof aVal === "string" && typeof bVal === "string") {
            return order === "asc"
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal)
        }

        // Handle number sorting for prepTime
        if (typeof aVal === "number" && typeof bVal === "number") {
            return order === "asc" ? aVal - bVal : bVal - aVal
        }

        return 0
    })

    const start = (page - 1) * limit
    return recipes.slice(start, start + limit)
}
