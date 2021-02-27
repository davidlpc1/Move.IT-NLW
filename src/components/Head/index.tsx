import NextHead from 'next/head';

interface HeadProps {
    title:string;
}

export default function Head({ title }:HeadProps){
    return (
        <NextHead>
            <meta charSet='utf-8' />
            <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
            <meta name='viewport' content='width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no' />
            <meta name='description' content='Stay Healty in your work' />
            <meta name='keywords' content='work,exercise,nextjs,vercel,nlw,rocketseat' />
            <title>{title}</title>
    
            <link rel='manifest' href='/manifest.json' />
            <link href='/icons/icon-72x72.png' rel='icon' type='image/png' sizes='72x72' />
            <link href='/icons/icon-96x96.png' rel='icon' type='image/png' sizes='96x96' />
            <link href='/icons/icon-128x128.png' rel='icon' type='image/png' sizes='32x32' />
            <link href='/icons/icon-144x144.png' rel='icon' type='image/png' sizes='144x144' />
            <link href='/icons/icon-152x152.png' rel='icon' type='image/png' sizes='152x152' />
            <link href='/icons/icon-192x192.png' rel='icon' type='image/png' sizes='192x192' />
            <link href='/icons/icon-384x384.png' rel='icon' type='image/png' sizes='384x384' />
            <link href='/icons/icon-512x512.png' rel='icon' type='image/png' sizes='512x512' />
            <meta name='theme-color' content='#5965e0' />
        </NextHead>
        
    )
}