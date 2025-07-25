import { Request, Response } from "express"
import * as RecipeService from "../services/recipe"
import sendAPIResponse from "../utils"
import API_STATUS from "../constants"

export const create = (req: Request, res: Response) => {
    try {
        const { name, ingredients, instructions, prepTime } = req.body
        if (!name || !ingredients || !instructions || !prepTime) {
            return res
                .status(API_STATUS.BAD_REQUEST)
                .json({ error: "Missing required fields" })
        }
        const recipe = RecipeService.createRecipe({
            name,
            ingredients,
            instructions,
            prepTime
        })
        res.status(API_STATUS.CREATED).json(
            sendAPIResponse(true, "Recipe created successfully", recipe)
        )
    } catch (err) {
        res.status(API_STATUS.INTERNAL_SERVER_ERROR).json({
            error: "Server error"
        })
    }
}

export const getOne = (req: Request, res: Response) => {
    const recipe = RecipeService.getRecipeById(req.params.id)
    if (!recipe)
        return res
            .status(API_STATUS.NOT_FOUND)
            .json({ error: "Recipe not found" })
    res.json(sendAPIResponse(true, "Recipe fetched successfully", recipe))
}

export const update = (req: Request, res: Response) => {
    const updated = RecipeService.updateRecipe(req.params.id, req.body)
    if (!updated)
        return res
            .status(API_STATUS.NOT_FOUND)
            .json({ error: "Recipe not found" })
    res.json(sendAPIResponse(true, "Recipe updated successfully", updated))
}

export const remove = (req: Request, res: Response) => {
    const success = RecipeService.deleteRecipe(req.params.id)
    if (!success)
        return res
            .status(API_STATUS.NOT_FOUND)
            .json({ error: "Recipe not found" })
    res.status(API_STATUS.SUCCESS).send()
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
