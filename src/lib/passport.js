const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');

//login de usuario
passport.use('local.login', new LocalStrategy( {
    usernameField: 'username',
    passwordField: 'pass',
    passReqToCallback: true
}, async (req, username, pass, done) => {
  const rows = await pool.query('SELECT *FROM users WHERE username = ?', [username]);
  if (rows.length > 0) {
      const user = rows[0];
      const validPassword = helpers.matchPassword(pass, user.pass);
      //validacion del password
      if (validPassword) {
          done(null, user, req.flash('exito','Bienvenido' + user.username));
      } else {
          done(null, false, req.flash('message','Contraseña Incorrecta'));
      }

  }else {
      return done(null, false, req.flash('message','El usuario ingresado no existe'));
  }
}));

//registro de usuario
passport.use('local.signup', new LocalStrategy( {
    usernameField: 'username',
    passwordField : 'pass',
    passReqToCallback: true
}, async (req, username, pass, done )=> {
    const { fullname } = req.body;
    const newUser = {
        username,
        pass,
        fullname

    };
    newUser.pass = await helpers.encryptPassword(pass);
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);

}));

passport.serializeUser((user , done) => {
    done(null, user.id);
});

passport.deserializeUser( async (id,done) => {
  const rows = await pool.query('SELECT * FROM users WHERE id = ?' , [id]);
  done(null, rows[0]);
});