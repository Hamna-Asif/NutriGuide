CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE user_details (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    nickname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    country VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    height FLOAT NULL,
    weight FLOAT NULL,
    gender VARCHAR(50) NULL,
    birthdate DATE NULL
);

CREATE TABLE user_targets (
    id INT PRIMARY KEY,
    target_weight FLOAT NOT NULL,
    duration_days INT NOT NULL,
    unit VARCHAR(10) NOT NULL
);

ALTER TABLE user_details
ADD bmi AS (weight / ((height / 100.0) * (height / 100.0))) PERSISTED;

CREATE TABLE admin (
    id INT IDENTITY(1,1) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
	name VARCHAR(255) NOT NULL,
	phone VARCHAR(15) NOT NULL
);

Insert into admin (email,password,name,phone) values ('admin@gmail.com', 'admin123','Minahil','3331419307');

CREATE TABLE foods (
    id INT IDENTITY(1,1) PRIMARY KEY,
    food_name VARCHAR(100) NOT NULL,
    calories INT NOT NULL,
    protein FLOAT NOT NULL,         -- in grams
    carbohydrates FLOAT NOT NULL,   -- in grams
    fats FLOAT NOT NULL,            -- in grams
    vitamins VARCHAR(255),          -- e.g., "Vitamin A, Vitamin C"
    minerals VARCHAR(255)           -- e.g., "Calcium, Iron"
);

ALTER TABLE foods
ADD CONSTRAINT UQ_foods_food_name UNIQUE (food_name);

INSERT INTO foods (food_name, calories, protein, carbohydrates, fats, vitamins, minerals)
VALUES
('Apple', 52, 0.3, 14, 0.2, 'Vitamin C', 'Potassium'),
('Banana', 89, 1.1, 23, 0.3, 'Vitamin B6, Vitamin C', 'Magnesium, Potassium'),
('Chicken Breast', 165, 31, 0, 3.6, '', 'Phosphorus, Selenium'),
('Brown Rice', 112, 2.6, 23, 0.9, '', 'Magnesium, Manganese'),
('Almonds', 575, 21, 22, 49, 'Vitamin E', 'Calcium, Magnesium, Zinc'),
('Broccoli', 55, 3.7, 11, 0.6, 'Vitamin C, Vitamin K', 'Iron, Calcium'),
('Salmon', 208, 20, 0, 13, 'Vitamin D, Vitamin B12', 'Selenium, Potassium'),
('Egg', 68, 6, 0.6, 4.8, 'Vitamin D, Vitamin B2', 'Iron, Phosphorus');


CREATE TABLE user_food_log(
    userId INT,
    date_entered DATE DEFAULT CONVERT (DATE, GETDATE()),
    total_calories INT,
    PRIMARY KEY (userId, date_entered)
);

CREATE TABLE food_items (
    id INT IDENTITY(1,1),
    userId INT,
    date_entered DATE,
    meal_type NVARCHAR(50),
    food_name VARCHAR(255),
    PRIMARY KEY (id),
    FOREIGN KEY (userId, date_entered) REFERENCES user_food_log (userId, date_entered),
    CONSTRAINT CK_meal_type CHECK (meal_type IN ('breakfast','lunch', 'snacks', 'dinner'))
);

alter table user_details
ADD exercise float;


ALTER TABLE user_food_log 
ADD total_protein FLOAT DEFAULT 0,
    total_carbohydrates FLOAT DEFAULT 0,
    total_fats FLOAT DEFAULT 0;


CREATE TRIGGER trg_calories_from_foods
ON food_items
INSTEAD OF INSERT
AS
BEGIN
    INSERT INTO food_items (userId, date_entered, meal_type, food_name)
    SELECT 
        i.userId,
        i.date_entered,
        i.meal_type,
        i.food_name
    FROM 
        inserted i
    WHERE EXISTS (
        SELECT 1
        FROM foods f
        WHERE f.food_name = i.food_name
    )
    AND EXISTS (
        SELECT 1
        FROM user_food_log u
        WHERE u.userId = i.userId AND u.date_entered = i.date_entered
    );

    UPDATE user_food_log
    SET 
        total_calories = ISNULL(total_calories, 0) + f.calories,
        total_protein = ISNULL(total_protein, 0) + f.protein,
        total_carbohydrates = ISNULL(total_carbohydrates, 0) + f.carbohydrates,
        total_fats = ISNULL(total_fats, 0) + f.fats
    FROM
        user_food_log u
        INNER JOIN inserted i ON u.userId = i.userId AND u.date_entered = i.date_entered
        INNER JOIN foods f ON f.food_name = i.food_name;
END;


ALTER TABLE user_targets
ADD total_daily_calories FLOAT NULL;

CREATE TRIGGER trg_CalculateTotalCalories
ON user_targets
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    WITH UserAge AS (
        SELECT
            ud.id,
            DATEDIFF(YEAR, ud.birthdate, GETDATE()) AS age
        FROM user_details ud
    ),
    UserBMR AS (
        SELECT
            ua.id,
            CASE
                WHEN ud.gender = 'male' THEN 
                    (10 * ud.weight) + (6.25 * ud.height) - (5 * ua.age) + 5
                WHEN ud.gender = 'female' THEN 
                    (10 * ud.weight) + (6.25 * ud.height) - (5 * ua.age) - 161
                ELSE NULL
            END AS bmr
        FROM user_details ud
        INNER JOIN UserAge ua ON ud.id = ua.id
    ),
    WeightInKg AS (
        SELECT
            ut.id,
            ut.target_weight * CASE WHEN ut.unit = 'lb' THEN 0.453592 ELSE 1 END AS target_weight_kg
        FROM user_targets ut
    ),
    CalorieAdjustment AS (
        SELECT
            ub.id,
            ub.bmr * ud.exercise AS adjusted_bmr,
            (wk.target_weight_kg - ud.weight) AS weight_change_kg,
            ut.duration_days AS duration_days,
            ((wk.target_weight_kg - ud.weight) * 7700.0) / ut.duration_days AS daily_adjustment
        FROM UserBMR ub
        INNER JOIN user_details ud ON ub.id = ud.id
        INNER JOIN user_targets ut ON ud.id = ut.id
        INNER JOIN WeightInKg wk ON ut.id = wk.id
    ),
    FinalCalories AS (
        SELECT
            ca.id,
            CASE
                WHEN ud.purpose IN ('Being Fit', 'Keeping Weight') THEN ca.adjusted_bmr
                WHEN ud.purpose = 'Losing Weight' THEN ca.adjusted_bmr - ca.daily_adjustment
                WHEN ud.purpose = 'Gaining Weight' THEN ca.adjusted_bmr + ca.daily_adjustment
                ELSE NULL
            END AS total_calories
        FROM CalorieAdjustment ca
        INNER JOIN user_details ud ON ca.id = ud.id
    )
    UPDATE ut
    SET ut.total_daily_calories = (
        SELECT fc.total_calories
        FROM FinalCalories fc
        WHERE fc.id = ut.id
    )
    FROM user_targets ut
    INNER JOIN Inserted i ON ut.id = i.id;
END;