const User = require('../modals/user');
const config = require('../config');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const ObjectId = require('mongoose').Types.ObjectId;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';

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

function sendOTP2Customer(mobile, mobileCode) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `https://2factor.in/API/R1/?module=TRANS_SMS&apikey=695f5ce6-fd28-11e8-a895-0200cd936042&to=${mobile}&from=TRSTOP&templatename=HB_TROOPSTOP&var1=${mobileCode}`,
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
        const mobile = req.body.mobile;
        const mobileCode = generateOTP(6);
        if (response) {
          sendOTP2Customer(mobile, mobileCode).then(otpResponse => {
            if (otpResponse) {
              User.findByIdAndUpdate({
                _id: new ObjectId(response._id)
              }, {
                $set: {
                  mobileCode: mobileCode
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
        } else {
          sendOTP2Customer(mobile, mobileCode).then(otpResponse => {
            if (otpResponse) {
              let user = new User({
                mobile: mobile,
                mobileCode: mobileCode,
              });
              user.save()
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
      })
      .catch(error => {
        res.status(400);
        return res.json({
          success: false,
          message: 'Unable to send otp!',
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
  if (!req.body.mobileCode) {
    res.status(400);
    return res.json({
      success: false,
      message: 'OTP is required!',
    });
  } else {
    User.findOne({
      mobile: parseInt(req.body.mobile, 10)
    })
      .then(response => {
        if (response) {
          if (parseInt(req.body.mobileCode) == parseInt(response.mobileCode)) {
            const token = jwt.sign({
              data: response,
            },
              config.serverSecret, {
              expiresIn: config.tokenExpire,
            });
            updateUserData({
              _id: response._id,
              emailVerified: 1
            });
            res.status(200);
            return res.json({
              success: true,
              message: 'Logged in successfully!',
              token: token
            });
          } else {
            res.status(400);
            return res.json({
              success: false,
              message: 'Invalid OTP!'
            });
          }
        } else {
          res.status(400);
          return res.json({
            success: false,
            message: 'You are not registered!'
          });
        }
      })
      .catch(error => {
        res.status(400);
        return res.json({
          success: false,
          message: 'Unable to login!'
        });
      });
  }
}

function updateUserData(data) {
  User.findByIdAndUpdate({
    _id: new ObjectId(data._id)
  }, {
    $set: data
  }, {
    new: true
  })
    .then()
    .catch();
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
        let user = new User(req.body);
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