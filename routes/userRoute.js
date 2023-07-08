

const express = require('express');
const { getUserValidator,
    createUserValidator, updateUserValidator,
    deleteUserValidator,changePasswordValidator,
    updateLoggedUserValidator
} = require('../utils/validator/userValidator');
const authService = require("../services/authService");


const { getUsers,
    getUser
    , createUser,
    updateUser,
    deleteUser,
    uploadUserImage,
    resizeImage,
    changeUserPassword,
    getLoggedUserData,
    updateloggedUserPassword,
    updateLoggedUserData,
    deleteloggedUserData
} = require('../services/userService');


const router = express.Router();

router.use(authService.auth);

router.get('/getMe', getLoggedUserData, getUser);
router.put('/changeMyPassword', updateLoggedUserData);
router.put('/updateMe', updateLoggedUserValidator, updateLoggedUserData);
router.delete('/deleteMe',deleteloggedUserData);

// Admin
router.use(authService.allowedTo('admin', 'manager'));
router.put(
  '/changePassword/:id',
  changePasswordValidator,
  changeUserPassword
);
router
  .route('/')
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);
router
  .route('/:id')
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);
module.exports = router;
