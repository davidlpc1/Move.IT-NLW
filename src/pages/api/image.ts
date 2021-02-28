import { NextApiResponse, NextApiRequest } from "next";
import puppeteer, { Page } from 'puppeteer-core'
import chrome from 'chrome-aws-lambda'

interface htmlProps {
  level: number;
  challengesCompleted: number;
  totalExperience: number;
}

let _page: Page | null
async function getOptions() {
  const isDev = !process.env.AWS_REGION
  let options;

  const chromeExecPaths = {
    win32: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    linux: '/usr/bin/google-chrome',
    darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  }
  
  const exePath = chromeExecPaths[process.platform]

  if (isDev) {
    options = {
      args: [],
      executablePath: exePath,
      headless: true
    }
  } else {
    options = {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless
    }
  }

  return options
}

async function getPage(): Promise<Page> {
  if (_page) {
    return _page
  }

  const options = await getOptions()
  const browser = await puppeteer.launch(options)

  _page = await browser.newPage()

  return _page
}


async function getScreenshot({ html }= { html:null },{ width, height } = { width: 800, height: 800 }) {
  const page = await getPage();

  if(html)  await page.setContent(html);

  await page.setViewport({ width, height });

  const file = await page.screenshot({ type: 'png' });

  return file;
} 

const svgLink = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTU0IiBoZWlnaHQ9Ijk0IiB2aWV3Qm94PSIwIDAgMTU0IDk0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyOS40MzMgMTEuOTUxMkMxMjkuMjY2IDE5LjQxOTIgMTM0LjU2OCAyMi45NDE3IDEzNC41NjggMjIuOTQxN0MxMzQuNTY4IDIyLjk0MTcgMTQwLjExOCAxOC44ODQ1IDE0MC4yNzkgMTEuNjA3N0MxNDAuNDQ0IDQuMzE4MDYgMTM0LjM0NSAwLjA0MDUyNzMgMTM0LjM0NSAwLjA0MDUyNzNDMTM0LjM0NSAwLjA0MDUyNzMgMTI5LjU5NiA0LjQ4MTk3IDEyOS40MzMgMTEuOTUxMlpNMTE5LjQzNSAyOS43MDlDMTIxLjYyNyAzNi42NDgxIDEyOC4wNzggMzguOTQ5OSAxMjguMDc4IDM4Ljk0OTlDMTI4LjA3OCAzOC45NDk5IDEzMi4xOTMgMzQuMDQ5NCAxMjkuOTQ5IDI2LjkyNjlDMTI3LjY5NiAxOS44MDY0IDEyMS45MSAxNi45MTYgMTIxLjkxIDE2LjkxNkMxMjEuOTEgMTYuOTE2IDExNy4yNDcgMjIuNzcxMiAxMTkuNDM1IDI5LjcwOVpNMTQxLjI3NSAyNi4yNDg1QzEzNy4wMTIgMzIuMzgwOCAxMzkuNDc4IDM4LjI4MjQgMTM5LjQ3OCAzOC4yODI0QzEzOS40NzggMzguMjgyNCAxNDYuMzI3IDM3Ljk5MjQgMTUwLjQ3MiAzMi4wMDc3QzE1NC42MyAyNi4wMjY1IDE1MS45MjkgMTkuMDYxNCAxNTEuOTI5IDE5LjA2MTRDMTUxLjkyOSAxOS4wNjE0IDE0NS41MzQgMjAuMTEwOSAxNDEuMjc1IDI2LjI0ODVaTTEyNS4zMTEgNDYuNjAyN0MxMjYuNjExIDUzLjk1OSAxMjEuODk3IDU4LjI4NTkgMTIxLjg5NyA1OC4yODU5QzEyMS44OTcgNTguMjg1OSAxMTUuNzk2IDU1LjE1NTMgMTE0LjUyNiA0Ny45OTA4QzExMy4yNzIgNDAuODIxMiAxMTguNjQ4IDM1LjYyNTEgMTE4LjY0OCAzNS42MjUxQzExOC42NDggMzUuNjI1MSAxMjQuMDA5IDM5LjI1MDcgMTI1LjMxMSA0Ni42MDI3Wk0xMTQuNTk1IDU5LjQ1MDVDMTEzLjk4NyA1MS45OTUyIDEwOC45OTQgNDcuODgwOSAxMDguOTk0IDQ3Ljg4MDlDMTA4Ljk5NCA0Ny44ODA5IDEwMy4xNTMgNTIuNTQ4NCAxMDMuNzQ1IDU5LjgwNjdDMTA0LjMzNyA2Ny4wNjUxIDExMC4xMDQgNzAuNzU4MSAxMTAuMTA0IDcwLjc1ODFDMTEwLjEwNCA3MC43NTgxIDExNS4xOTkgNjYuOTAwMyAxMTQuNTk1IDU5LjQ1MDVaTTk0LjY2MjMgODIuMzY3M0M5NC42NjIzIDgyLjM2NzMgOTAuMTk0OCA3Ny4xNTkzIDkxLjcwODcgNzAuMDI5MUM5My4yMjY4IDYyLjkwMDEgMTAwLjE2IDYwLjExNzUgMTAwLjE2IDYwLjExNzVDMTAwLjE2IDYwLjExNzUgMTAzLjc1MiA2NS41MDg4IDEwMi4yMDIgNzIuODI2NUMxMDAuNjQ3IDgwLjE0MzEgOTQuNjYyMyA4Mi4zNjczIDk0LjY2MjMgODIuMzY3M1pNMTM1LjQ4NSA1My4xODgyQzEzNS40ODUgNTMuMTg4MiAxMzQuODcxIDQ2LjgxNDIgMTQwLjczMSA0Mi4yMTE0QzE0Ni42MDUgMzcuNjA3OCAxNTMuMDE1IDM4LjQ5NDUgMTUzLjAxNSAzOC40OTQ1QzE1My4wMTUgMzguNDk0NSAxNTMuNTU1IDQ1Ljk2MzggMTQ3LjgzMSA1MC40NTE1QzE0Mi4xMDUgNTQuOTQzNCAxMzUuNDg1IDUzLjE4ODIgMTM1LjQ4NSA1My4xODgyWk0xMzQuMDk5IDU3LjYzNTVDMTI3LjM2MyA2MC44MjQyIDEyNi41NTQgNjcuMTc5NSAxMjYuNTU0IDY3LjE3OTVDMTI2LjU1NCA2Ny4xNzk1IDEzMi42MjMgNzAuMzYxMiAxMzkuMTg4IDY3LjI2NDVDMTQ1Ljc1MyA2NC4xNjc4IDE0Ni44ODIgNTYuNzU1NCAxNDYuODgyIDU2Ljc1NTRDMTQ2Ljg4MiA1Ni43NTU0IDE0MC44MzcgNTQuNDU2NiAxMzQuMDk5IDU3LjYzNTVaTTExNS43OTUgNzcuODQ1MkMxMTUuNzk1IDc3Ljg0NTIgMTE4LjQ3NyA3Mi4wMjM5IDEyNS44NSA3MS4wMzlDMTMzLjIzMiA3MC4wNTIgMTM4LjI4OSA3NC4wODI0IDEzOC4yODkgNzQuMDgyNEMxMzguMjg5IDc0LjA4MjQgMTM0Ljk4MiA4MC44MDU1IDEyNy43OTggODEuNzY3NkMxMjAuNjA4IDgyLjczMjggMTE1Ljc5NSA3Ny44NDUyIDExNS43OTUgNzcuODQ1MlpNMTIzLjE1OSA4Ni43NTI2QzEyMy4xNTkgODYuNzUyNiAxMTguNjA0IDgyLjE0NTIgMTExLjE3IDgyLjIzMjhDMTAzLjc0IDgyLjMyNTcgMTAwLjM5OCA4Ny43ODIxIDEwMC4zOTggODcuNzgyMUMxMDAuMzk4IDg3Ljc4MjEgMTA0LjU5MSA5My4yMTQ4IDExMS44MzYgOTMuMTMxOUMxMTkuMDg3IDkzLjAyNzUgMTIzLjE1OSA4Ni43NTI2IDEyMy4xNTkgODYuNzUyNlpNMTMyLjczMSAyNi45MjgzTDEzNi4yMjEgMjYuMjMzOUMxMzYuMjkyIDI2LjYxNTUgMTQzLjA1IDY0LjYzMTggODguMzgyNiA5MC45MjM0TDg2Ljg2NTggODcuNzEyOUMxMzguOTAyIDYyLjY3NiAxMzMuMDExIDI4LjM3MDggMTMyLjczMSAyNi45MjgzWk0xMS43NTQyIDI2LjU0ODhDMTYuMDE2NiAzMi42ODExIDEzLjU1MTEgMzguNTgyNyAxMy41NTExIDM4LjU4MjdDMTMuNTUxMSAzOC41ODI3IDYuNzAyMjEgMzguMjkyNyAyLjU1NjkxIDMyLjMwOEMtMS42MDExNSAyNi4zMjY4IDEuMDk5NTcgMTkuMzYxNyAxLjA5OTU3IDE5LjM2MTdDMS4wOTk1NyAxOS4zNjE3IDcuNDk0OTIgMjAuNDExMiAxMS43NTQyIDI2LjU0ODhaTTI0Ljk1MTcgMzkuMjUwMkMyNC45NTE3IDM5LjI1MDIgMzEuNDAyNiAzNi45NDgzIDMzLjU5NDcgMzAuMDA5M0MzNS43ODI2IDIzLjA3MTUgMzEuMTE5OSAxNy4yMTYzIDMxLjExOTkgMTcuMjE2M0MzMS4xMTk5IDE3LjIxNjMgMjUuMzMzMiAyMC4xMDY3IDIzLjA4MDIgMjcuMjI3MkMyMC44MzY5IDM0LjM0OTcgMjQuOTUxNyAzOS4yNTAyIDI0Ljk1MTcgMzkuMjUwMlpNMzEuMTMyNCA1OC41ODYyQzMxLjEzMjQgNTguNTg2MiAyNi40MTg0IDU0LjI1OTMgMjcuNzE4NSA0Ni45MDNDMjkuMDE5NyAzOS41NTEgMzQuMzgxMiAzNS45MjU0IDM0LjM4MTIgMzUuOTI1NEMzNC4zODEyIDM1LjkyNTQgMzkuNzU3IDQxLjEyMTUgMzguNTAyNyA0OC4yOTExQzM3LjIzMzQgNTUuNDU1NiAzMS4xMzI0IDU4LjU4NjIgMzEuMTMyNCA1OC41ODYyWk00NC4wMzU0IDQ4LjE4MTJDNDQuMDM1NCA0OC4xODEyIDM5LjA0MjIgNTIuMjk1NSAzOC40MzQ4IDU5Ljc1MDdDMzcuODMwNSA2Ny4yMDA2IDQyLjkyNTIgNzEuMDU4NCA0Mi45MjUyIDcxLjA1ODRDNDIuOTI1MiA3MS4wNTg0IDQ4LjY5MyA2Ny4zNjUzIDQ5LjI4NDcgNjAuMTA3QzQ5Ljg3NjQgNTIuODQ4NyA0NC4wMzU0IDQ4LjE4MTIgNDQuMDM1NCA0OC4xODEyWk02MS4zMjA0IDcwLjMyOTRDNjIuODM0MiA3Ny40NTk2IDU4LjM2NjggODIuNjY3NiA1OC4zNjY4IDgyLjY2NzZDNTguMzY2OCA4Mi42Njc2IDUyLjM4MjEgODAuNDQzNCA1MC44Mjc0IDczLjEyNjhDNDkuMjc2OSA2NS44MDkgNTIuODY5NCA2MC40MTc4IDUyLjg2OTQgNjAuNDE3OEM1Mi44Njk0IDYwLjQxNzggNTkuODAyMiA2My4yMDA0IDYxLjMyMDQgNzAuMzI5NFpNMTguNDYxMSAyMy4yNDJDMTguNDYxMSAyMy4yNDIgMjMuNzYzNiAxOS43MTk1IDIzLjU5NjQgMTIuMjUxNUMyMy40MzM1IDQuNzgyMjYgMTguNjg0MyAwLjM0MDgyMSAxOC42ODQzIDAuMzQwODIxQzE4LjY4NDMgMC4zNDA4MjEgMTIuNTg1IDQuNjE4MzYgMTIuNzQ5OSAxMS45MDhDMTIuOTExNSAxOS4xODQ4IDE4LjQ2MTEgMjMuMjQyIDE4LjQ2MTEgMjMuMjQyWk0xMi4yOTggNDIuNTExN0MxOC4xNTgxIDQ3LjExNDUgMTcuNTQzOCA1My40ODg1IDE3LjU0MzggNTMuNDg4NUMxNy41NDM4IDUzLjQ4ODUgMTAuOTIzNyA1NS4yNDM3IDUuMTk4MTkgNTAuNzUxOEMtMC41MjYxNjYgNDYuMjY0MSAwLjAxMzU4NzMgMzguNzk0OCAwLjAxMzU4NzMgMzguNzk0OEMwLjAxMzU4NzMgMzguNzk0OCA2LjQyMzkgMzcuOTA4MSAxMi4yOTggNDIuNTExN1pNMjYuNDc1MiA2Ny40Nzk4QzI2LjQ3NTIgNjcuNDc5OCAyNS42NjY0IDYxLjEyNDUgMTguOTMwNCA1Ny45MzU4QzEyLjE5MjUgNTQuNzU2OSA2LjE0NyA1Ny4wNTU3IDYuMTQ3IDU3LjA1NTdDNi4xNDcgNTcuMDU1NyA3LjI3NTY2IDY0LjQ2ODEgMTMuODQwOSA2Ny41NjQ4QzIwLjQwNjIgNzAuNjYxNSAyNi40NzUyIDY3LjQ3OTggMjYuNDc1MiA2Ny40Nzk4Wk0yNy4xNzk1IDcxLjMzOTNDMzQuNTUyMiA3Mi4zMjQyIDM3LjIzNDcgNzguMTQ1NCAzNy4yMzQ3IDc4LjE0NTRDMzcuMjM0NyA3OC4xNDU0IDMyLjQyMTMgODMuMDMzMSAyNS4yMzE4IDgyLjA2NzlDMTguMDQ3NyA4MS4xMDU4IDE0Ljc0MDMgNzQuMzgyNyAxNC43NDAzIDc0LjM4MjdDMTQuNzQwMyA3NC4zODI3IDE5Ljc5NzEgNzAuMzUyMyAyNy4xNzk1IDcxLjMzOTNaTTQxLjg1ODYgODIuNTMzMUMzNC40MjUyIDgyLjQ0NTUgMjkuODY5OCA4Ny4wNTI5IDI5Ljg2OTggODcuMDUyOUMyOS44Njk4IDg3LjA1MjkgMzMuOTQyNCA5My4zMjc4IDQxLjE5MzIgOTMuNDMyMkM0OC40MzgyIDkzLjUxNTEgNTIuNjMxIDg4LjA4MjQgNTIuNjMxIDg4LjA4MjRDNTIuNjMxIDg4LjA4MjQgNDkuMjg4OSA4Mi42MjYgNDEuODU4NiA4Mi41MzMxWk0xNi44MDgzIDI2LjUzNDJMMjAuMjk3OCAyNy4yMjg2QzIwLjAxODMgMjguNjcxMSAxNC4xMjczIDYyLjk3NjMgNjYuMTYzNCA4OC4wMTMyTDY0LjY0NjYgOTEuMjIzN0M5Ljk3OTEzIDY0LjkzMjEgMTYuNzM3MiAyNi45MTU4IDE2LjgwODMgMjYuNTM0MloiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcikiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhciIgeDE9Ijc2LjUxNDUiIHkxPSIwLjA0MDUyNzMiIHgyPSI3Ni41MTQ1IiB5Mj0iOTMuNDMzMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRENEREUwIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0RDRERFMCIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg=='

const getHTML = ({
  level,
  challengesCompleted,
  totalExperience,
}: htmlProps) => `
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Rajdhani:wght@600&display=swap"
      rel="stylesheet"
    />

    <style>
        *{
            margin:0;
            padding:0;
            box-sizing: border-box;
            font-family: "Inter", sans-serif;
        }
        body{
            height:100%;
            width:100%;
            padding: 100px;
        }
        .container {
            width:100%;
            height:100%;

            display:flex;
            gap: 100px;
        }
        .left,.right {
            flex:1;
        }
        .left{
            background: url('${svgLink}') no-repeat top;
            background-size: contain;
            text-align: center;
        }
        .left p {
            font-weight: bold;
            font-size: 306.055px;
            line-height: 262px;
            
            color: #5965E0;
            text-shadow: 0px 10px 16px rgba(89, 101, 224, 0.3);
        }
        .left span {
            font-weight: 600;
            font-size: 56px;
            line-height: 66px;

            color: #2E384D;
        }
        .right {
        }
        .right div {
            padding: 40px 0;
            border-bottom: 1.5px solid #DCDDE0;
        }
        .right div p {
            font-weight: bold;
            font-size: 24px;
            line-height: 29px;
            
            text-transform: uppercase;
            color: #666666;
            opacity: 0.5;
        }
        .right div span {
            font-weight: 500;
            font-size: 40px;
            line-height: 48px;
            color: #666666;
        }
        .purple {
            color:#5965E0 !important;
        }
        .space-to-svg{
            margin-bottom: 40px;
        }
    </style>
  </head>
  <body>
        <div class="container">
            <div class="left">
                <p>${level}</p>
                <span>Avancei para <br /> o próximo nível</span>
            </div>

            <div class="right">
                <div>
                    <p>Desafios</p>
                    <span>
                        <span class="purple">${challengesCompleted}</span>
                        completados
                    </span>
                </div>

                <div class="space-to-svg">
                    <p>Experiência</p>
                    <span>
                        <span class="purple">${totalExperience}</span>
                        xp
                    </span>
                </div>

                <svg width="250" height="50" viewBox="0 0 250 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0)">
                    <path d="M107.307 22.0488L103.685 38.6822H94.2489L97.8712 22.0488C98.1551 20.7414 97.9905 20.5004 96.6534 20.5004H93.2468C91.9182 20.5004 91.64 20.7414 91.359 22.0155C91.359 22.0155 91.359 22.0377 91.359 22.0488L87.7367 38.6822H78.2919L81.9171 22.0488C82.201 20.7414 82.0363 20.5004 80.6964 20.5004H77.2898C75.9499 20.5004 75.6802 20.7441 75.3963 22.0488L71.7712 38.6822H62.335L67.8962 13.149H75.561L76.776 15.3428C77.4749 14.6247 78.321 14.0583 79.2591 13.6803C80.1972 13.3023 81.2063 13.1213 82.2208 13.149H84.1768C87.8672 13.149 90.3569 14.714 91.2483 17.3593C92.8976 14.4176 95.2879 13.149 98.175 13.149H100.134C105.678 13.149 108.497 16.6419 107.307 22.0488Z" fill="#5965E0"/>
                    <path d="M136.084 22.0487L134.401 29.7824C133.223 35.1893 128.879 38.6821 123.329 38.6821H116.181C110.64 38.6821 107.821 35.1865 108.999 29.7796L110.682 22.0487C111.858 16.6418 116.201 13.1489 121.754 13.1489H128.913C134.443 13.1489 137.265 16.6418 136.084 22.0487ZM126.639 22.0487C126.923 20.7413 126.759 20.5003 125.422 20.5003H122.015C120.675 20.5003 120.405 20.7441 120.122 22.0487L118.435 29.7796C118.151 31.087 118.319 31.328 119.656 31.328H123.063C124.4 31.328 124.672 31.0842 124.956 29.7796L126.639 22.0487Z" fill="#5965E0"/>
                    <path d="M194.976 20.0156C194.631 21.467 193.797 22.7639 192.608 23.6996L187.802 27.5775C186.65 28.523 185.2 29.0548 183.695 29.0843H177.04L176.89 29.7685C176.606 31.0759 176.771 31.3169 178.111 31.3169H192.509L190.908 38.671H174.625C169.083 38.671 166.264 35.1754 167.442 29.7685L169.126 22.0376C170.304 16.6307 174.647 13.1378 180.197 13.1378H187.362C192.89 13.1489 195.748 16.459 194.976 20.0156ZM185.091 22.0487C185.375 20.7413 185.211 20.5003 183.871 20.5003H180.464C179.13 20.4975 178.846 20.744 178.562 22.0487L177.994 24.7106H183.615C183.867 24.7004 184.109 24.6102 184.304 24.4537C184.498 24.2972 184.635 24.083 184.694 23.8436L185.091 22.0487Z" fill="#5965E0"/>
                    <path d="M205.583 34.3471C205.061 36.7431 203.122 38.6849 200.19 38.6849C197.257 38.6849 196.167 36.7459 196.689 34.3471C197.212 31.9484 199.151 30.0122 202.083 30.0122C205.016 30.0122 206.097 31.9484 205.583 34.3471Z" fill="#4CD62B"/>
                    <path d="M225.83 13.1489L224.229 20.4975L220.255 38.6794H210.821L214.796 20.4975H210.086L211.69 13.1461L225.83 13.1489ZM218.824 8.38186C217.189 6.60911 217.688 3.56772 219.934 1.59276C222.179 -0.382197 225.328 -0.542853 226.971 1.23267C228.615 3.0082 228.107 6.04958 225.861 8.02454C223.616 9.9995 220.462 10.1602 218.824 8.38186Z" fill="#5965E0"/>
                    <path d="M240.972 16.8246L238.15 29.7796C237.866 31.087 238.031 31.328 239.368 31.328H245.236L243.635 38.6821H235.888C230.346 38.6821 227.525 35.1865 228.703 29.7796L231.524 16.8246H227.956L229.557 9.47044H233.134L234.446 3.44861H243.89L242.579 9.47044H250.005L248.395 16.8246H240.972Z" fill="#5965E0"/>
                    <path d="M25.5092 3.745H37.4834L27.522 50H15.5479L25.5092 3.745Z" fill="#5965E0"/>
                    <path d="M43.0786 3.745H55.0527L47.2914 39.9868H35.3145L43.0786 3.745Z" fill="#5965E0"/>
                    <path d="M7.76415 3.745H19.7383L11.9769 39.9868H0L7.76415 3.745Z" fill="#5965E0"/>
                    <path d="M171.026 13.1489L153.531 38.6821H143.879L137.497 13.1489H147.833L150.612 29.9153L160.69 13.1628L171.026 13.1489Z" fill="#5965E0"/>
                    </g>
                    <defs>
                    <clipPath id="clip0">
                    <rect width="250" height="50" fill="white"/>
                    </clipPath>
                    </defs>
                </svg>

            </div>
        </div>
  </body>
</html>
`;

export default async function GenerateImage(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { level, challengesCompleted, totalExperience } = req.query;

  if (!level || !challengesCompleted || !totalExperience) return;

  const html = getHTML({
    level: Number(level),
    challengesCompleted: Number(challengesCompleted),
    totalExperience: Number(totalExperience),
  });

  
//   const file = await getScreenshot({ html });
  const file = await getScreenshot({ html }, { width: 1200, height: 630 });
  
  res.setHeader('Content-Type', 'image/png')
  res.end(file);
}
