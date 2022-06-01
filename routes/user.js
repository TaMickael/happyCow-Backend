const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

// Import du modèle
const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
  const { email, username, password, statut, location, birth } = req.fields;

  try {
    //Si je recois bien tous les elements
    if (email && username && password && statut && location && birth) {
      //Si les username et l'email n'est pas déja utilisé
      const emailAlreadyUsed = await User.findOne({ email: email });
      const usernameAlreadyUsed = await User.findOne({ username: username });
      if (!usernameAlreadyUsed) {
        if (!emailAlreadyUsed) {
          // Je crée un token et un salt
          const token = uid2(16);
          const salt = uid2(16);
          // Je colle mon salt et mon password et j'encrypte le tout pour faire un hash
          const hash = SHA256(password + salt).toString(encBase64);
          // Je crée un nouveau User
          const newUser = new User({
            email,
            username,
            password,
            statut,
            location,
            birth,
            token,
            salt,
            hash,
          });
          // Je le sauvegarde
          await newUser.save();
          // Je répond au client
          res.json({
            _id: newUser._id,
            email: email,
            username: username,
            password: password,
            statut: statut,
            location: location,
            birth: birth,
            token: token,
          });
        } else {
          res.status(400).json({ message: "Cet email est déjà utilisé" });
        }
      } else {
        res.status(400).json({ message: "Ce username est déjà utilisé" });
      }
    } else {
      res.status(400).json({ message: "Missing parameters" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/user/signin", async (req, res) => {
  try {
    //Si je recois bien tous les elements
    if (username && password) {
      //Si les username et l'email n'est pas déja utilisé
      const emailAlreadyUsed = await User.findOne({ email: email });
      const usernameAlreadyUsed = await User.findOne({ username: username });
      if (!usernameAlreadyUsed) {
        if (!emailAlreadyUsed) {
          // Je crée un token et un salt
          const token = uid2(16);
          const salt = uid2(16);
          // Je colle mon salt et mon password et j'encrypte le tout pour faire un hash
          const hash = SHA256(password + salt).toString(encBase64);
          // Je crée un nouveau User
          const newUser = new User({
            username,
            password,
            token,
            salt,
            hash,
          });
          // Je le sauvegarde
          await newUser.save();
          // Je répond au client
          res.json({
            _id: newUser._id,
            username: username,
            password: password,
            token: token,
          });
        } else {
          res.status(400).json({ message: "Cet email est déjà utilisé" });
        }
      } else {
        res.status(400).json({ message: "Ce username est déjà utilisé" });
      }
    } else {
      res.status(400).json({ message: "Missing parameters" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
