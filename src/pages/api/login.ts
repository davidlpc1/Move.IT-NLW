import axios from "axios";

export default function Login(req, res) {
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
            res.json({ _token });
        })
        .catch((err) => res.status(500).json({ message: err.message }));
}
