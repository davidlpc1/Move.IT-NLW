import fs from "fs";
import users from "./users.json";
import path from 'path';

interface CreateUserProps {
  name: string;
  challengesCompleted: number;
  level: number;
  currentExperience: number;
  totalExperience:number;
}

export default function createUser(user: CreateUserProps) {
  if(!user.totalExperience){
    user.totalExperience = 0;
    for(let index = 1;index < user.level;index++){
      user.totalExperience += Math.pow((index + 1) * 4, 2)
    }
    user.totalExperience += user.currentExperience;
  }

  const index = users.findIndex(user => user.name === user.name)
  if(index != -1) users[index] = user;
  else users.push(user);

  fs.writeFileSync(path.join(__dirname,"users.json"), JSON.stringify(users,null,4));
}
