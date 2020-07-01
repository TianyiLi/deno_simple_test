import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

const salt = bcrypt.genSaltSync(10)
const hash = bcrypt.hashSync('test', salt)

console.log(bcrypt.compareSync('test', hash))