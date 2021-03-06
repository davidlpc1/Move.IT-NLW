import axios from "axios";
import dotenv from 'dotenv';
import { NextApiResponse,NextApiRequest } from "next";
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

const configDotenv = () =>  dotenv.config();

const opts = { headers: { accept: "application/json" } };

export default async function Login(req:NextApiRequest, res:NextApiResponse) {
  configDotenv();
  const { code } = req.query;
  const { client_id,client_secret } = process.env;

  const body = {
    client_id,
    client_secret,
    code,
  };
  
  const { data } = await axios.post(
    `https://github.com/login/oauth/access_token`,
    body,
    opts
  );

  const userRequest = await axios.get("https://api.github.com/user", {
    headers: { Authorization: `token ${data.access_token}` },
  });

  setCookie(res,"username", userRequest.data.login);
  console.log('Redirecting...')
  res.redirect('/cycle');
}
