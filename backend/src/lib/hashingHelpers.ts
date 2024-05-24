import bcrypt from "bcrypt";

const saltRounds = 10; // Numero di round di hashing per la sicurezza

// Funzione per hashare la password
export const hashPassword = async (password: string) => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
};

// Funzione per verificare la password hashata
export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => {
  try {
    const result = await bcrypt.compare(password, hashedPassword);
    return result; // Ritorna true se la password corrisponde alla sua hash
  } catch (error) {
    throw new Error("Error verifying password");
  }
};
