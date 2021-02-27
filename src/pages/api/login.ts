import { Octokit } from "@octokit/core";
import axios from "axios";

export default async function Login(req, res) {
    let token;
    const body = {
        client_id: '4974563f2c8d1922e576',
        client_secret: '3621e940ee14206f28726fbb0963db952892f1e6',
        code: req.query.code,
    };
    const opts = { headers: { accept: "application/json" } };
    axios
        .post(`https://github.com/login/oauth/access_token`, body, opts)
        .then((res) => res.data["access_token"])
        .then((_token) => {
            token = _token;
            return;
        })
        .catch((err) => res.status(500).json({ message: err.message }));

    const octokit = new Octokit({ auth: '5a964c806e2cc4f1921fe1642cf95ef25073b623' });
    const responseOfApi = await octokit.request('GET https://api.github.com/user')
    res.json(responseOfApi)
}
