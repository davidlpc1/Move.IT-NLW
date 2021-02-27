import axios from "axios";
import dotenv from 'dotenv';
import { NextApiResponse } from "next";
import { serialize, CookieSerializeOptions } from "cookie";

const setCookie = (
  res: NextApiResponse,
  name: string,
  value: unknown,
  options: CookieSerializeOptions = {}
) => {
  const stringValue =
    typeof value === "object" ? "j:" + JSON.stringify(value) : String(value);

  if ("maxAge" in options) {
    options.expires = new Date(Date.now() + options.maxAge);
    options.maxAge /= 1000;
  }

  options.path = '/';

  res.setHeader("Set-Cookie", serialize(name, String(stringValue), options));
};

export default async function Login(req, res) {
  dotenv.config();

  const { code } = req.query;
  const { client_id,client_secret } = process.env;
  console.log(client_id, client_secret)

  const body = {
    client_id,
    client_secret,
    code,
  };

  const opts = { headers: { accept: "application/json" } };
  
  const { data } = await axios.post(
    `https://github.com/login/oauth/access_token`,
    body,
    opts
  );

  console.log(data)

  const userRequest = await axios.get("https://api.github.com/user", {
    headers: { Authorization: `token ${data.access_token}` },
  });

  setCookie(res,"username", userRequest.data.login);
  console.log('Redirecting...')
  res.redirect('/cycle');
}
