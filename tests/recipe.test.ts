import request from "supertest"
import app from "../src/app"

describe("Recipe API", () => {
    const mockRecipe = {
        name: "Test Recipe",
        ingredients: ["ingredient 1", "ingredient 2"],
        instructions: "Test instructions",
        prepTime: 30
    }

    describe("POST /recipes", () => {
        it("should create a new recipe", async () => {
            const response = await request(app)
                .post("/recipes")
                .send(mockRecipe)
                .expect(201)

            expect(response.body).toMatchObject({
                success: true,
                message: "Recipe created successfully",
                data: expect.objectContaining({
                    id: expect.any(String),
                    name: mockRecipe.name,
                    ingredients: mockRecipe.ingredients,
                    instructions: mockRecipe.instructions,
                    prepTime: mockRecipe.prepTime,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                })
            })
        })

        it("should return 400 for missing fields", async () => {
            const response = await request(app)
                .post("/recipes")
                .send({ name: "Incomplete Recipe" })
                .expect(400)

            expect(response.body).toMatchObject({
                error: "Missing required fields"
            })
        })
    })

    describe("GET /recipes/:id", () => {
        it("should get recipe by id", async () => {
            // First create a recipe
            const createResponse = await request(app)
                .post("/recipes")
                .send(mockRecipe)

            const recipeId = createResponse.body.data.id

            // Then get it
            const response = await request(app)
                .get(`/recipes/${recipeId}`)
                .expect(200)

            expect(response.body).toMatchObject({
                success: true,
                message: "Recipe fetched successfully",
                data: expect.objectContaining({
                    id: recipeId,
                    name: mockRecipe.name
                })
            })
        })

        it("should return 404 for non-existent recipe", async () => {
            const response = await request(app)
                .get("/recipes/non-existent-id")
                .expect(404)

            expect(response.body).toMatchObject({
                error: "Recipe not found"
            })
        })
    })

    describe("PATCH /recipes/:id", () => {
        it("should update recipe", async () => {
            // Create recipe first
            const createResponse = await request(app)
                .post("/recipes")
                .send(mockRecipe)

            const recipeId = createResponse.body.data.id

            // Update it
            const updateData = { name: "Updated Recipe" }
            const response = await request(app)
                .patch(`/recipes/${recipeId}`)
                .send(updateData)
                .expect(200)

            expect(response.body).toMatchObject({
                success: true,
                message: "Recipe updated successfully",
                data: expect.objectContaining({
                    id: recipeId,
                    name: "Updated Recipe"
                })
            })
        })

        it("should return 404 for non-existent recipe", async () => {
            const response = await request(app)
                .patch("/recipes/non-existent-id")
                .send({ name: "Updated" })
                .expect(404)

            expect(response.body).toMatchObject({
                error: "Recipe not found"
            })
        })
    })

    describe("DELETE /recipes/:id", () => {
        it("should delete recipe", async () => {
            // Create recipe first
            const createResponse = await request(app)
                .post("/recipes")
                .send(mockRecipe)

            const recipeId = createResponse.body.data.id

            // Delete it
            const response = await request(app)
                .delete(`/recipes/${recipeId}`)
                .expect(200)

            expect(response.body).toMatchObject({
                success: true,
                message: "Recipe deleted successfully"
            })

            // Verify it's deleted
            await request(app).get(`/recipes/${recipeId}`).expect(404)
        })

        it("should return 404 for non-existent recipe", async () => {
            const response = await request(app)
                .delete("/recipes/non-existent-id")
                .expect(404)

            expect(response.body).toMatchObject({
                error: "Recipe not found"
            })
        })
    })

    describe("GET /recipes", () => {
        beforeEach(async () => {
            // Create test recipes
            await request(app)
                .post("/recipes")
                .send({ ...mockRecipe, name: "Recipe 1" })
            await request(app)
                .post("/recipes")
                .send({ ...mockRecipe, name: "Recipe 2" })
            await request(app)
                .post("/recipes")
                .send({ ...mockRecipe, name: "Recipe 3" })
        })

        it("should list recipes with default pagination", async () => {
            const response = await request(app).get("/recipes").expect(200)

            expect(response.body).toMatchObject({
                success: true,
                message: "Recipes fetched successfully",
                data: expect.any(Array)
            })

            expect(response.body.data.length).toBeGreaterThan(0)
        })

        it("should support pagination", async () => {
            const response = await request(app)
                .get("/recipes?page=1&limit=2")
                .expect(200)

            expect(response.body.data).toHaveLength(2)
        })

        it("should support search", async () => {
            const response = await request(app)
                .get("/recipes?search=Recipe 1")
                .expect(200)

            expect(response.body.data).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ name: "Recipe 1" })
                ])
            )
        })

        it("should support sorting", async () => {
            const response = await request(app)
                .get("/recipes?sortBy=name&order=asc")
                .expect(200)

            const names = response.body.data.map((r: any) => r.name)
            expect(names).toEqual([...names].sort())
        })
    })
})
