const express = require('express');
const db = require("../models")
const User = db.User
const { Op } = require('sequelize');

//Create

const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body
        console.log(req.body);

        const hashPassword = await User.hashPassword(password);
        console.log("hashed password is---------------->", hashPassword);
        const users = await User.create({
            firstName,
            lastName,
            email,
            password: hashPassword
        });

        res.status(200).json({ message: "User Created Successfully", users })
    } catch (error) {
        console.error("error: ", error);
        res.status(500).json({ message: "Error creating user", error: error.message })
    }
}

//Read
const readUser = async (req, res) => {
    try {
        let { page, pageSize, search } = req.query;

        page = page ? parseInt(page) : 1;
        pageSize = pageSize ? parseInt(pageSize) : 10;
        search = search || '';

        let offset = (page - 1) * pageSize;

        const whereCondition = search
            ? { email: { [Op.like]: `%${search}%` } }
            : {};

        //with searching
        const users = await User.findAndCountAll({
            where: whereCondition,
            limit: pageSize,
            offset: offset,
            attribute: { exclude: ['password'] }
        });

        res.status(200).json({
            message: 'Users fetched successfully',
            currentPage: page,
            users: users.rows
        })

    } catch (error) {
        console.error("Error reading user", error)
        res.status(500).json({ message: "Failed to get users" })
    }
}


//update
const updateUser = async (req, res) => {
    try {
        const { id, firstName, lastName, email } = req.body;

        const user = await User.findByPk(id)
        //console.log("************************",user)
        if (!user) {
            console.log("User not found")
            return res.status(404).json({ message: "User not found" })
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;

        await user.save();
        const userData = user.toJSON();
        delete userData.password;

        return res.status(200).json({ message: "User updated successfully", user: userData })

    } catch (error) {
        console.log("error updating a user");
        return res.status(500).json({ message: "error updating a user", error })
    }
};

//delete
const deleteUser = async (req, res) => {
    try {
        const { id } = req.body;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        await user.destroy();
        return res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
        console.error("error deleting the user")
        return res.status(500).json({ message: "error deleting the user" })
    }
}


module.exports = {
    createUser,
    readUser,
    updateUser,
    deleteUser
}


