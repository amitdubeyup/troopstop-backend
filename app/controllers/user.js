const User = require('../modals/user');
const config = require('../config');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const ObjectId = require('mongoose').Types.ObjectId;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
const requestIp = require('request-ip');
const _ = require('lodash');

module.exports = {
  sendOtp: sendOtp,
  loginUser: loginUser,
  registerUser: registerUser,
  fetchUser: fetchUser,
  fetchAllUser: fetchAllUser,
  updateUser: updateUser,
  updateAllUser: updateAllUser,
  removeUser: removeUser,
};

function generateOTP(n) {
  return Math.floor(Math.random() * (9 * Math.pow(10, n - 1))) + Math.pow(10, n - 1);
}

function sendOTP2Customer(mobile, otp) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `https://2factor.in/API/R1/?module=TRANS_SMS&apikey=695f5ce6-fd28-11e8-a895-0200cd936042&to=${mobile}&from=HOSTBK&templatename=HB_POS_OTP&var1=${otp}`,
    })
      .then(response => {
        if (response['status'] == 200) {
          if (response['data']['Status'] == 'Success') {
            resolve(true);
          } else {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      })
      .catch(error => {
        resolve(false);
      });
  });
}

function sendOtp(req, res) {
  if (!req.body.mobile) {
    res.status(400);
    return res.json({
      success: false,
      message: 'Mobile number is required!',
    });
  } else {
    User.findOne({
      mobile: req.body.mobile,
    })
      .then(response => {
        if (response) {
          if (response.status == 'inactive') {
            res.status(400);
            return res.json({
              success: false,
              message: 'Account blocked, Please contact with support team!',
            });
          } else {
            const mobile = req.body.mobile;
            const otp = generateOTP(6);
            sendOTP2Customer(mobile, otp).then(otpResponse => {
              if (otpResponse) {
                User.findByIdAndUpdate({
                  _id: new ObjectId(response._id)
                }, {
                  $set: {
                    otp: otp
                  }
                }, {
                  new: true
                })
                  .then(response => {
                    res.status(200);
                    return res.json({
                      success: true,
                      message: 'OTP sent successfully!',
                    });
                  })
                  .catch(error => {
                    res.status(400);
                    return res.json({
                      success: false,
                      message: 'Unable to send otp!',
                      error: error,
                    });
                  });
              } else {
                res.status(400);
                return res.json({
                  success: false,
                  message: 'Unable to send otp!',
                });
              }
            });
          }
        } else {
          res.status(400);
          return res.json({
            success: false,
            message: 'You are not registered!',
          });
        }
      })
      .catch(error => {
        res.status(400);
        return res.json({
          success: false,
          message: 'Unable to send otp!',
          error: error,
        });
      });
  }
}

function loginUser(req, res) {
  if (!req.body.mobile) {
    res.status(400);
    return res.json({
      success: false,
      message: 'Mobile number is required!',
    });
  }
  if (!req.body.otp) {
    res.status(400);
    return res.json({
      success: false,
      message: 'OTP is required!',
    });
  } else {
    User.findOne({
      mobile: req.body.mobile,
    })
      .then(response => {
        if (response) {
          if (parseInt(req.body.otp) == parseInt(response.otp)) {
            if (response.status == 'inactive') {
              res.status(400);
              return res.json({
                success: false,
                message: 'Account blocked, Please contact with support team!',
              });
            } else {
              const token = jwt.sign({
                data: response,
              },
                config.serverSecret, {
                expiresIn: config.tokenExpire,
              });
              res.status(200);
              return res.json({
                success: true,
                message: 'Logged in successfully!',
                token: token
              });
            }
          } else {
            res.status(400);
            return res.json({
              success: false,
              message: 'Invalid OTP!',
            });
          }
        } else {
          res.status(400);
          return res.json({
            success: false,
            message: 'You are not registered!',
          });
        }
      })
      .catch(error => {
        res.status(400);
        return res.json({
          success: false,
          message: 'Unable to login!',
          error: error,
        });
      });
  }
}

function registerUser(req, res) {
  const query = {
    mobile: parseInt(req.body.mobile, 10)
  };
  User.find(query)
    .then(result => {
      if (result.length > 0) {
        res.status(400);
        return res.json({
          success: false,
          message: 'User already exit!',
        });
      } else {
        let user = new User({
          fullName: req.body.fullName,
          salutation: req.body.salutation,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          mobile: req.body.mobile,
          alternateMobile: req.body.alternateMobile,
          gender: req.body.gender,
          dob: req.body.dob,
          addressOne: req.body.addressOne,
          addressTwo: req.body.addressTwo,
          landmark: req.body.landmark,
          city: req.body.city,
          state: req.body.state,
          pincode: req.body.pincode,
          latitude: req.body.latitude,
          longitude: req.body.longitude,
          aadhar: req.body.aadhar,
          pan: req.body.pan,
          photo: req.body.photo,
          createdFrom: req.body.createdFrom,
          createdIp: req.body.createdIp,
          otp: req.body.otp,
          status: req.body.status,
        });
        user.save()
          .then(response => {
            res.status(200);
            return res.json({
              success: true,
              message: 'Account created successfully!',
              data: response,
            });
          })
          .catch(error => {
            res.status(400);
            return res.json({
              success: false,
              message: 'Unable to create account!',
              error: error,
            });
          });
      }
    })
    .catch(error => {
      res.status(400);
      return res.json({
        success: false,
        message: 'Unable to create account!',
        error: error,
      });
    });
}

function fetchUser(req, res) {
  User.find({
    _id: req['token']['_id']
  }).then(response => {
    res.status(200);
    return res.json({
      success: true,
      message: 'Data fetched successfully!',
      data: response,
    });
  }).catch(error => {
    res.status(400);
    return res.json({
      success: false,
      message: 'Unable to fetch data!',
      error: error,
    });
  });
}

function fetchAllUser(req, res) {
  let query = req.body.query || {};
  let skip = 0;
  let limit = 10;
  if (req.body.skip) {
    skip = req.body.skip;
  }
  if (req.body.limit) {
    limit = req.body.limit;
  }
  User.find(query)
    .sort({
      createdAt: -1
    })
    .skip(skip)
    .limit(limit)
    .then(response => {
      res.status(200);
      return res.json({
        success: true,
        message: 'Data fetched successfully!',
        data: response,
      });
    })
    .catch(error => {
      res.status(400);
      return res.json({
        success: false,
        message: 'Unable to fetch data!',
        error: error,
      });
    });
}

function updateUser(req, res) {
  User.findByIdAndUpdate({
    _id: new ObjectId(req['token']['_id'])
  }, {
    $set: req.body
  }, {
    new: true
  })
    .then(response => {
      res.status(200);
      return res.json({
        success: true,
        message: 'Data updated successfully!',
        data: response,
      });
    })
    .catch(error => {
      res.status(400);
      return res.json({
        success: false,
        message: 'Unable to update data!',
        error: error,
      });
    });
}

function updateAllUser(req, res) {
  User.updateMany(req.body.query, {
    $set: req.body.data
  }, {
    multi: true
  })
    .then(response => {
      res.status(200);
      return res.json({
        success: true,
        message: 'Data updated successfully!',
        data: response,
      });
    })
    .catch(error => {
      res.status(400);
      return res.json({
        success: false,
        message: 'Unable to update data!',
        error: error,
      });
    });
}

function removeUser(req, res) {
  User.findByIdAndRemove({
    _id: req['token']['_id'],
  })
    .then(response => {
      res.status(200);
      return res.json({
        success: true,
        message: 'Data removed successfully!',
      });
    })
    .catch(error => {
      res.status(400);
      return res.json({
        success: false,
        message: 'Unable to remove data!',
        error: error,
      });
    });
}