const bcryptjs = require('bcryptjs');

const helpers ={};

helpers.encryptPassword = async (pass) => {
 const salt =  await bcryptjs.genSalt(10);
 const hash = await bcryptjs.hash(pass,salt);
 return hash;
};

helpers.matchPassword = async (pass, savePassword) => {
   try {
    await bcryptjs.compare(pass,savePassword);
   } catch(e) {
        console.log(e);
   }
};

module.exports = helpers;