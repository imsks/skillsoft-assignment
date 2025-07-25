import { Request, Response } from "express"
import * as RecipeService from "../services/recipe"

export const create = (req: Request, res: Response) => {
    try {
        const { name, ingredients, instructions, prepTime } = req.body
        if (!name || !ingredients || !instructions || !prepTime) {
            return res.status(400).json({ error: "Missing required fields" })
        }
        const recipe = RecipeService.createRecipe({
            name,
            ingredients,
            instructions,
            prepTime
        })
        res.status(201).json(recipe)
    } catch (err) {
        res.status(500).json({ error: "Server error" })
    }
}

export const getOne = (req: Request, res: Response) => {
    const recipe = RecipeService.getRecipeById(req.params.id)
    if (!recipe) return res.status(404).json({ error: "Recipe not found" })
    res.json(recipe)
}

export const update = (req: Request, res: Response) => {
    const updated = RecipeService.updateRecipe(req.params.id, req.body)
    if (!updated) return res.status(404).json({ error: "Recipe not found" })
    res.json(updated)
}

export const remove = (req: Request, res: Response) => {
    const success = RecipeService.deleteRecipe(req.params.id)
    if (!success) return res.status(404).json({ error: "Recipe not found" })
    res.status(204).send()
}

export const list = (req: Request, res: Response) => {
    const {
        page = "1",
        limit = "10",
        search = "",
        sortBy = "createdAt",
        order = "desc"
    } = req.query
    const recipes = RecipeService.listRecipes(
        parseInt(page as string),
        parseInt(limit as string),
        search as string,
        sortBy as string,
        order as "asc" | "desc"
    )
    res.json(recipes)
}
