import fs from "fs";
import users from "./users.json";
import path from "path";

interface CreateUserProps {
  name: string;
  challengesCompleted: number;
  level: number;
  totalExperience: number;
}

export default function createUser(user: CreateUserProps) {
  const index = users.findIndex(user => user.name === user.name)
  if(index) users[index] = user;
  else users.push(user);

  console.log(users)
  fs.writeFileSync(path.join(__dirname,'users.json'), JSON.stringify(users,null,4));
}
