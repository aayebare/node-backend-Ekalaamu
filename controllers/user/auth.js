import sequelize from "sequelize";
import bcrypt from "bcrypt";

import connection from "../../models";
import { User } from "../../models/user";
import { Actions } from "../../helpers/actions";
import { signToken } from "../../helpers/jwt";
import { sendMail, verificationEmail } from '../../helpers/mailer';

const db = connection.sync();
const Op = sequelize.Op;

export default class AuthController {
  static signUp = (req, res, next) => {
    db.then(async resp => {
      User.findAll({
        where: {
          email: {
            [Op.or]: [req.body.email]
          }
        }
      }).done(
        async users => {
          if (users.length) {
            return res.status(400).json({ errors: ['Email already in use.'] })
          }
          const user = await Actions.addData(User, req.body, [
            "id",
            "firstname",
            "lastname",
            "email",
            "password"
          ]);
          const token = signToken(user.id);
          const emailBody = verificationEmail(user, token);

          await sendMail(emailBody, 'Verification', res)
        }
      );
    });
  };

  static verifyEmail = (req, res, next) => {
      
  }

  static login = (req, res, next) => {

    db.then(async resp=> {
      User.findOne(
        {
        where: {
          email: req.body.email  
        }
      }
      ).done( 
        (users) => {
          if(!users){
            return res.status(404).json({Errors: "User doesn't exist or email is invalid"})
          }
        
          bcrypt.compare(req.body.password, users.dataValues.password, (result,err)=>{
            if(err===false){
              res.status(404).json({Errors: "Password and email do not match for this user"})
            }
            res.status(200).json({success: "Successfully logged in", token: signToken(users.dataValues.id)})
          })
        }
      )
    });
  };
}
