import bcrypt from "bcryptjs";

const test = async () => {
  const password = 'secret';
  const hashed = await bcrypt.hash(password, 10);
  const isMatch = await bcrypt.compare('secret', hashed);

  console.log('Hashed:', hashed);
  console.log('Match:', isMatch);
};

test();