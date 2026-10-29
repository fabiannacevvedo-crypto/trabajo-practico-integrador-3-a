import bcrypt from "bcrypt";

//hashear contraseña con bcrypt
export const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.has(password,saltRounds);
};

//comparar contraseña en texto plano con el hash
export const comparePassword = async (password,hashedPassword) => {
    return await bcrypt.compare(password,hashedPassword);
};
