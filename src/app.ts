import express from "express"
import recipeRoutes from "./routes/recipe"

const app = express()
app.use(express.json())

app.use("/recipes", recipeRoutes)

app.get("/", (_req, res) => res.send("Recipe API is running"))

export default app
