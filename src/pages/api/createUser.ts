import fs from "fs";
import users from "./users.json";
import path from 'path';
import { NextApiRequest, NextApiResponse } from "next";

interface CreateUserProps {
  name: string;
  challengesCompleted: number;
  level: number;
  currentExperience: number;
  totalExperience:number;
}

export default function createUser(req:NextApiRequest,res:NextApiResponse) {
  const { user } = req.body;
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

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

  fs.writeFileSync(path.join(__dirname,"./users.json"), JSON.stringify(users,null,4));
  return;
}
