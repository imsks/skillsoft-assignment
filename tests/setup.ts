import fs from "fs"
import path from "path"

// Clean up test data before/after tests
const TEST_DATA_PATH = path.join(__dirname, "../src/data/test-recipes.json")

beforeEach(() => {
    // Clean up test data file
    if (fs.existsSync(TEST_DATA_PATH)) {
        fs.unlinkSync(TEST_DATA_PATH)
    }
})

afterAll(() => {
    // Final cleanup
    if (fs.existsSync(TEST_DATA_PATH)) {
        fs.unlinkSync(TEST_DATA_PATH)
    }
})
