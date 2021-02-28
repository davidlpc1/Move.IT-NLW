import { NextApiResponse,NextApiRequest } from "next";
import axios from 'axios';

interface User {
    name: string;
    challengesCompleted: number;
    level: number;
    currentExperience: number;
    totalExperience: number;
}

export default async function ShareOnTwitter(req:NextApiRequest, res:NextApiResponse) {
    const { name } = req.query;

    const { data } = await axios.get(`https://moveit-json.herokuapp.com/users?name=${name}`)
    if(data.length === 0) return;
    const user : User = data[0];

    const url = `https://move-it-davidlpc1.vercel.app/api/image?level=${user.level}&challengesCompleted=${user.challengesCompleted}&totalExperience=${user.totalExperience}`
      
    return res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content="https://move-it-davidlpc1.vercel.app/" />
            <meta property="twitter:title" content="Avancei de level no Move.it" />
            <meta property="twitter:description" content="Stay Healty in your work" />
            <meta property="twitter:image" content="${url}" />

            <title>Level Up | Moveit</title>
        </head>
        <body>
            <img src="${url}" alt="Avancei de nível no Move.it" style="width: 100vw;object-fit:cover;"></img>
        </body>
        </html>
    `)
}
