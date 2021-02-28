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
    const user : User = data[0];

    const url = `http://localhost:3000/api/image?level=${user.level}&challengesCompleted=${user.challengesCompleted}&totalExperience=${user.totalExperience}`
      
    return res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content="${url}" />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={bg} />

            <title>Level Up | Moveit</title>
        </head>
        <body></body>
        </html>
    `)
}
