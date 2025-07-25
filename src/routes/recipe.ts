import { Router } from "express"
import * as RecipeController from "../controllers/recipe"

const router = Router()

router.post("/", RecipeController.create)
router.get("/:id", RecipeController.getOne)
router.patch("/:id", RecipeController.update)
router.delete("/:id", RecipeController.remove)
router.get("/", RecipeController.list)

export default router
