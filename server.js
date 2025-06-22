const express = require("express");
const sql = require("mssql");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");


const app = express();
app.use(bodyParser.json());

// Configuration for SQL Server connection
const config = {
    server: "DESKTOP-F5HJ01V", // Your SQL Server instance
    authentication: {
        type: "default",
        options: {
            userName: "ha", // Replace with your SQL Server username
            password: "12345678", // Replace with your SQL Server password
        },
    },
    options: {
        database: "NutriGuideDB", // Your database name
        encrypt: true, // Encryption settings
        trustServerCertificate: true, // Bypass SSL certificate validation for local dev
        port: 1433, // Default SQL Server port
    },
};

// Test the connection to SQL Server
sql.connect(config)
    .then(() => console.log("Connected to SQL Server"))
    .catch((err) => console.error("Error connecting to SQL Server:", err));

//API signup    
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const pool = await sql.connect(config);
        const result = await pool.request()
        .input('Email', sql.VarChar, email)
        .input('Password', sql.VarChar, hashedPassword)  // Use hashed password here
        .query(`
          INSERT INTO users (email, password)
          VALUES (@Email, @Password);

          SELECT id FROM users WHERE email = @Email;
        `);

        if (result.recordset.length > 0) {
            const userId = result.recordset[0].id;  // Access the first item in the recordset
            console.log("New user ID:", userId);
            res.status(201).json({ message: "Sign-up successful.", userId });
        } else {
            res.status(500).json({ error: "Failed to create user" });
        }
    } catch (err) {
        console.error("Signup error:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});


// Login API Endpoint
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const pool = await sql.connect(config);

        const query = `
            SELECT id, password
            FROM users
            WHERE email = @Email
        `;
        const result = await pool
            .request()
            .input("Email", sql.VarChar, email)
            .query(query);

        if (result.recordset.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const { id, password: hashedPassword } = result.recordset[0];
        const isPasswordValid = await bcrypt.compare(password, hashedPassword);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        res.status(200).json({ message: "Login successful", userId: id });
    } catch (err) {
        console.error("Error during login:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

//Check-email API for forgot password
app.post('/check-email', async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
  
    try {
      const pool = await sql.connect(config);
  
      const query = `
        SELECT id
        FROM users
        WHERE email = @Email
      `;
      const result = await pool.request().input('Email', sql.VarChar, email).query(query);
  
      if (result.recordset.length === 0) {
        return res.status(404).json({ error: 'Email not found' });
      }
  
      const { id } = result.recordset[0];
      res.status(200).json({ message: 'Email found', userId: id });
    } catch (err) {
      console.error('Error during email check:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
});
  
//Reset password API for forgot password
app.post('/reset-password', async (req, res) => {
    const { userId, newPassword } = req.body;
  
    if (!userId || !newPassword) {
      return res.status(400).json({ error: 'User ID and new password are required' });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const pool = await sql.connect(config);
  
      const query = `
        UPDATE users
        SET password = @Password
        WHERE id = @UserId
      `;
      await pool
        .request()
        .input('Password', sql.VarChar, hashedPassword)
        .input('UserId', sql.Int, userId)
        .query(query);
  
      res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) {
      console.error('Error during password reset:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

// Add new routes to handle form submissions


// API to save Page 1 data
app.post("/infopage1", async (req, res) => {
    const { userId, name, nickname, email, country, phone, purpose } = req.body;

    if (!name || !nickname || !email || !country || !phone || !purpose) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const pool = await sql.connect(config);

        await pool
            .request()
            .input("UserId", sql.Int, userId)
            .input("Name", sql.VarChar, name)
            .input("Nickname", sql.VarChar, nickname)
            .input("Email", sql.VarChar, email)
            .input("Country", sql.VarChar, country)
            .input("Phone", sql.VarChar, phone)
            .input("Purpose", sql.VarChar, purpose)
            .query(`
                MERGE INTO user_details AS target
                USING (SELECT @UserId AS id, @Name AS name, @Nickname AS nickname, 
                              @Email AS email, @Country AS country, 
                              @Phone AS phone, @Purpose AS purpose) AS source
                ON target.id = source.id
                WHEN MATCHED THEN
                    UPDATE SET name = source.name, 
                               nickname = source.nickname, 
                               email = source.email,
                               country = source.country,
                               phone = source.phone,
                               purpose = source.purpose
                WHEN NOT MATCHED THEN
                    INSERT (id, name, nickname, email, country, phone, purpose)
                    VALUES (source.id, source.name, source.nickname, source.email, 
                            source.country, source.phone, source.purpose);
            `);

        res.status(201).json({ success: true, message: "Page 1 data saved successfully" });
    } catch (err) {
        console.error("Error saving Page 1 data:", err.message);
        res.status(500).json({ error: "Internal server error" });
        //console.error("Error saving Page 2 data:", err);
    }
});

// API to save Page 2 data
app.post("/infopage2", async (req, res) => {
    const { userId, height, weight, gender, exercise, birthdate } = req.body;

    if (!height || !weight || !gender || !exercise || !birthdate) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const pool = await sql.connect(config);


        await pool
            .request()
            .input("UserId", sql.Int, userId)
            .input("Height", sql.Float, height)
            .input("Weight", sql.Float, weight)
            .input("Gender", sql.VarChar, gender)
            .input("Exercise", sql.Float, exercise)
            .input("Birthdate", sql.Date, birthdate)
            .query(`
                UPDATE user_details
                SET height = @Height, weight = @Weight, gender = @Gender, birthdate = @Birthdate, exercise = @exercise
                WHERE id = @UserId
            `);

        res.status(200).json({ success: true, message: "Page 2 data saved successfully" });
    } catch (err) {
        console.error("Error saving Page 2 data:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});


// Add an API endpoint for saving target weight and duration
app.post("/targetpage", async (req, res) => {
    const { userId, targetWeight, durationDays, unit } = req.body;

    // Validate input data
    if (!targetWeight || !durationDays || !unit) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const pool = await sql.connect(config);

        // Save the target data to the database
        const saveTargetQuery = `
            MERGE INTO user_targets AS target
            USING (VALUES (@UserId, @TargetWeight, @DurationDays, @Unit)) AS source (id, target_weight, duration_days, unit)
            ON target.id = source.id
            WHEN MATCHED THEN
                UPDATE SET target.target_weight = source.target_weight,
                    target.duration_days = source.duration_days,
                    target.unit = source.unit
            WHEN NOT MATCHED THEN
                INSERT (id, target_weight, duration_days, unit)
                VALUES (source.id, source.target_weight, source.duration_days, source.unit);`;
        await pool
            .request()
            .input("UserId", sql.Int, userId)
            .input("TargetWeight", sql.Float, targetWeight)
            .input("DurationDays", sql.Int, durationDays)
            .input("Unit", sql.VarChar, unit)
            .query(saveTargetQuery);

        res.status(201).json({ success: true, message: "Target saved successfully" });
    } catch (err) {
        console.error("Error saving target data:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

//API to get BMI info
app.get("/BMIpage/:userId", async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const pool = await sql.connect(config);

        const result = await pool
            .request()
            .input("UserId", sql.Int, userId)
            .query(`
                SELECT height, weight, bmi,
                    CASE
                        WHEN bmi < 18.5 THEN 'Underweight'
                        WHEN bmi >= 18.5 AND bmi < 25 THEN 'Normal weight'
                        WHEN bmi >= 25 AND bmi < 30 THEN 'Overweight'
                        ELSE 'Obesity'
                    END AS category
                FROM user_details
                WHERE id = @UserId
            `);

        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (err) {
        console.error("Error retrieving BMI data:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// API to get user details and target weight
app.get("/profile/:userId", async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const pool = await sql.connect(config);

        const result = await pool
            .request()
            .input("UserId", sql.Int, userId)
            .query(`
                SELECT
                    ud.name, ud.nickname, ud.id, ud.email, ud.phone,
                    ud.height, ud.weight, ut.target_weight 
                FROM user_details ud
                LEFT JOIN user_targets ut ON ud.id = ut.id
                WHERE ud.id = @UserId;
            `);
        if (result.recordset.length > 0) {
                res.status(200).json(result.recordset[0]);
        } else {
                res.status(404).json({ error: "User not found" });
        }
        // if (result.recordset.length === 0) {
        //     return res.status(404).json({ error: "User not found" });
        // }
        // else
        // {res.status(200).json({ success: true, data: result.recordset[0] });}
    } catch (err) {
        console.error("Error fetching user profile:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

//Admin Login API
app.post("/adminlogin", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const pool = await sql.connect(config);

        const query = `
            SELECT id, password
            FROM admin
            WHERE email = @Email
        `;
        const result = await pool
            .request()
            .input("Email", sql.VarChar, email)
            .query(query);

        if (result.recordset.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Extract id and password from result.recordset[0]
        const { id, password: storedPassword } = result.recordset[0];

        // Direct comparison of plaintext passwords
        if (password !== storedPassword) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        res.status(200).json({ message: "Admin Login successful", adminId: id }); 
    } catch (err) {
        console.error("Error during login:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});


// API to get admin details 
app.get("/admin2/:adminId", async (req, res) => {
    const { adminId } = req.params;

    if (!adminId) {
        return res.status(400).json({ error: "Admin ID is required" });
    }

    try {
        const pool = await sql.connect(config);

        const result = await pool
            .request()
            .input("AdminId", sql.Int, adminId)
            .query(`
                SELECT
                    ad.name, ad.id, ad.email, ad.phone 
                FROM admin ad
                WHERE ad.id = @AdminId;
            `);
        if (result.recordset.length > 0) {
                res.status(200).json(result.recordset[0]);
        } else {
                res.status(404).json({ error: "Admin not found" });
        }
        
    } catch (err) {
        console.error("Error fetching admin profile:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Search User API to get user details and target weight by username  
app.get("/searchuser/:username", async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }

    try {
        // Connect to SQL Server
        const pool = await sql.connect(config);

        // Execute the query to fetch user details and target weight
        const result = await pool
            .request()
            .input("Username", sql.VarChar(255), username)
            .query(`
                SELECT
                    ud.name, ud.nickname, ud.id, ud.email, ud.phone,
                    ud.height, ud.weight, ut.target_weight 
                FROM user_details ud
                LEFT JOIN user_targets ut ON ud.id = ut.id
                WHERE ud.name = @Username;
            `);

        // Check if the user exists
        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (err) {
        console.error("Error fetching user profile:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete user API to delete a user by username 
app.delete("/searchuser/:username", async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }

    try {
        const pool = await sql.connect(config);

        // Retrieve the user ID based on the given username
        const userIdResult = await pool
            .request()
            .input("Username", sql.VarChar(255), username)
            .query(`
                SELECT id
                FROM user_details
                WHERE name = @Username;
            `);

        if (userIdResult.recordset.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const userId = userIdResult.recordset[0].id;

        // Delete user from all related tables using the retrieved ID
        await pool.request().input("UserId", sql.Int, userId).query(`
            DELETE FROM user_targets WHERE id = @UserId;
            DELETE FROM user_details WHERE id = @UserId;
            DELETE FROM users WHERE id = @UserId;
        `);

        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Error deleting user:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Add Food API
app.post('/addfood', async (req, res) => {
    const { foodName, calories, protein, carbohydrates, fats, vitamins, minerals } = req.body;

    // Validate required fields
    if (!foodName || !calories || !protein || !carbohydrates || !fats || !vitamins || !minerals) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('FoodName', sql.VarChar, foodName)
            .input('Calories', sql.Int, calories)
            .input('Protein', sql.Float, protein)
            .input('Carbohydrates', sql.Float, carbohydrates)
            .input('Fats', sql.Float, fats)
            .input('Vitamins', sql.VarChar, vitamins)
            .input('Minerals', sql.VarChar, minerals)
            .query(`
                INSERT INTO foods (food_name, calories, protein, carbohydrates, fats, vitamins, minerals)
                VALUES (@FoodName, @Calories, @Protein, @Carbohydrates, @Fats, @Vitamins, @Minerals);
            `);

        res.status(201).json({ message: "Food item added successfully." });
    } catch (err) {
        console.error("Error adding food:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Search Food API to get food details by name
app.get("/searchfood/:foodName", async (req, res) => {
    const { foodName } = req.params;

    if (!foodName) {
        return res.status(400).json({ error: "Food name is required" });
    }

    try {
        // Connect to SQL Server
        const pool = await sql.connect(config);

        // Execute the query to fetch food details
        const result = await pool
            .request()
            .input("FoodName", sql.VarChar(100), foodName)
            .query(`
                SELECT 
                    id, food_name, calories, protein, carbohydrates, fats, vitamins, minerals
                FROM foods
                WHERE food_name = @FoodName;
            `);

        // Check if the food exists
        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]); // Send the food details as the response
        } else {
            res.status(404).json({ error: "Food not found" });
        }
    } catch (err) {
        console.error("Error fetching food details:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});


// Add User Food API for diary page
app.post("/addfooddiary", async (req, res) => {
    const { userId, dateEntered, mealType, foodName } = req.body;

    if (!userId || !mealType || !foodName) {
        return res.status(400).json({ error: "UserId, mealType, and foodName are required." });
    }

    try {
        const currentDate = new Date().toISOString().split("T")[0];
        const date = dateEntered || currentDate;

        const pool = await sql.connect(config);

        // Ensure an entry exists in `user_food_log`
        await pool
            .request()
            .input("UserId", sql.Int, userId)
            .input("DateEntered", sql.Date, date)
            .query(`
                IF NOT EXISTS (
                    SELECT 1 
                    FROM user_food_log 
                    WHERE userId = @UserId AND date_entered = @DateEntered
                )
                BEGIN
                    INSERT INTO user_food_log (userId, date_entered, total_calories, total_protein, total_carbohydrates, total_fats)
                    VALUES (@UserId, @DateEntered, 0, 0, 0, 0);
                END
            `);

        // Fetch food details
        const foodResult = await pool
            .request()
            .input("FoodName", sql.VarChar(255), foodName)
            .query(`
                SELECT calories, protein, carbohydrates, fats
                FROM foods
                WHERE food_name = @FoodName;
            `);

        if (foodResult.recordset.length === 0) {
            return res.status(404).json({ error: "Food not found in the database." });
        }

        const { calories, protein, carbohydrates, fats } = foodResult.recordset[0];

        // Insert food item into `food_items`
        await pool
            .request()
            .input("UserId", sql.Int, userId)
            .input("DateEntered", sql.Date, date)
            .input("MealType", sql.VarChar(50), mealType)
            .input("FoodName", sql.VarChar(255), foodName)
            .query(`
                INSERT INTO food_items (userId, date_entered, meal_type, food_name)
                VALUES (@UserId, @DateEntered, @MealType, @FoodName);
            `);

        // Update calories, protein, carbohydrates, and fats in `user_food_log`
        await pool
            .request()
            .input("UserId", sql.Int, userId)
            .input("DateEntered", sql.Date, date)
            .input("Calories", sql.Int, calories)
            .input("Protein", sql.Float, protein)
            .input("Carbohydrates", sql.Float, carbohydrates)
            .input("Fats", sql.Float, fats)
            .query(`
                UPDATE user_food_log
                SET total_calories = ISNULL(total_calories, 0) + @Calories,
                    total_protein = ISNULL(total_protein, 0) + @Protein,
                    total_carbohydrates = ISNULL(total_carbohydrates, 0) + @Carbohydrates,
                    total_fats = ISNULL(total_fats, 0) + @Fats
                WHERE userId = @UserId AND date_entered = @DateEntered;
            `);

        res.status(200).json({ message: "Food added successfully and nutrients updated." });
    } catch (err) {
        console.error("Error adding food:", err.message);
        res.status(500).json({ error: "Internal server error." });
    }
});


// Get food data for a specific user, date, and meal type
app.get('/getfood/:userId/:date', async (req, res) => {
    const { userId, date } = req.params;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('UserId', sql.Int, userId)
            .input('DateEntered', sql.Date, date)
            .query(`
                SELECT 
                    fi.meal_type,
                    fi.food_name,
                    f.calories,
                    f.protein,
                    f.carbohydrates,
                    f.fats
                FROM 
                    food_items fi
                INNER JOIN 
                    foods f ON fi.food_name = f.food_name
                WHERE 
                    fi.userId = @UserId AND fi.date_entered = @DateEntered
                ORDER BY 
                    fi.meal_type;
            `);

        res.json(result.recordset);
    } catch (error) {
        console.error("Error in /getfood API:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

//Get Total Daily Calories API
app.get("/user-calories/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        const pool = await sql.connect(config);

        // Query to fetch total_daily_calories
        const result = await pool.request()
            .input("id", sql.Int, userId)
            .query(`
                SELECT total_daily_calories
                FROM user_targets
                WHERE id = @id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const totalCalories = result.recordset[0].total_daily_calories;
        res.json({ total_daily_calories: totalCalories });
    } catch (err) {
        console.error("Error fetching daily calories:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});


// Start the Express server
app.listen(3000, () => console.log("Server running on port 3000"));



