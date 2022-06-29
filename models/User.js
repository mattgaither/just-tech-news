const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');


// Create out user mdoel
class User extends Model {
    // Set up method to run on instance data (per user) to check password
    checkPassword(loginPw) {
        return bcrypt.compareSync( loginPw, this.password);
    };
};

// Define table columns and configuration
User.init(
    {
        // TABLE COLUMNS DEFINITIONS GO HERE
        // Column settings (https://sequelize.org/v5/manual/models-definition.html) and Options for DataTypes (https://sequelize.org/v5/manual/data-types.html)
        // Define an id column
        id: {
            // Use the specail Sequelize Datatypes object provide what type of data it is
            type: DataTypes.INTEGER,
            // This is the equivalent of SQL's `NOT NULL` option 
            allowNull: false,
            // Instruct that this is the Primary Key. If we do not do this Sequelize will create one for us. It is best practice to define all data ourselves
            primaryKey: true,
            // Turn on auto increment 
            autoIncrement: true
        },

        // Define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },

        // Define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // There connot be any duplicate email values
            unique: true,
            // If allowNull is set to false, we can run our data through validators before creating the table data
            validate: {
                isEmail: true
            }
        },

        // Define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // This means the password must be at least four characters long
                len: [4]
            }
        }
    },
    {
        hooks: {
            //set up beforeCreate lifecycle "hook" functionality
            // beforeCreate(userData) {
            //     return bcrypt.hash(userData.password, 10).then(newUserData => {
            //         return newUserData
            //     });
            // }
            //Made the above function an async function
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData
            },
            // Set up beforeUpdate lifecycle "hook" functionality
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
        // TABLE CONFIGURATION OPYIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration)
        // Pass in our inported sequelize connection (the direct connection to our database)
        sequelize,
        // Don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,
        // Don't pluralize name of the database table 
        freezeTableName: true,
        // Use underscores instead of camel-casing (i.e `comment_text` and not `commentText`)
        underscored: true,
        // Make it so our model name stays lowercase in the database
        modelName: 'user'
    }
);

module.exports = User;
