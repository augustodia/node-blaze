import express from "express";
import puppeteer from "puppeteer";
import DoubleData from "./models/DoubleData.js";
import DoubleRodadasSemBranco from "./models/DoubleRodadasSemBranco.js";
import RodadasParaBranco from "./models/RodadasParaBranco.js";
import moment from "moment";
import io from "socket.io-client";

import cors from "cors";
// import apiRoutes from './routes/api'

const server = express();
server.use(cors());

// server.use(express.static(path.join(__dirname, '../public')));
//Deve ser exatamente nessa ordem
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
// server.use(apiRoutes);

server.listen(3000, () => {
  console.log("Servidor subiu com sucesso");
});

let qtdRodadas = await DoubleRodadasSemBranco.findByPk(1);

if (qtdRodadas !== null) {
  qtdRodadas.qtdrodadas;
} else {
  await DoubleRodadasSemBranco.create({ qtdrodadas: 0 });
  qtdRodadas = await DoubleRodadasSemBranco.findByPk(1);
  console.log(qtdRodadas);
}

/*=========================== VERSÃO RODANDO COM WEBSOCKET   =============================*/ 

const socket = io("wss://api-v2.blaze.com", {
  path: "/replication",
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("connect");

  socket.emit("cmd", { id: "subscribe", payload: { room: "double_v2" } });
});

let idDouble = null;

socket.on("data", async (data) => {
  if (data.id == "double.tick" && data.payload.status == "complete" && idDouble !== data.payload.id) {
    console.log(idDouble, data.payload.id)
    idDouble = data.payload.id;
      console.log(new Date(
        new Date(data.payload.updated_at).getTime() -
          new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 19)
        .replace("T", " "))
    
    
      let date = new Date(
        new Date(data.payload.created_at).getTime() -
          new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
    switch (data.payload.color) {
      case 0:
        console.log(String.fromCodePoint(0x26aa), "Branco");
        let rodadas = ++qtdRodadas.qtdrodadas;
        qtdRodadas.qtdrodadas = 0;
        qtdRodadas.save();
        await DoubleData.create({
          cor: 0,
          createdAt: date,
        });
        await RodadasParaBranco.create({
          qtdrodadas: rodadas,
        });
        break;
      case 1:
        console.log(String.fromCodePoint(0x1f534), "Vermelho");
        qtdRodadas.qtdrodadas++;
        qtdRodadas.save();
        await DoubleData.create({
          cor: 1,
          createdAt: date,
        });
        break;
      case 2:
        console.log(String.fromCodePoint(0x26ab), "Preto");
        qtdRodadas.qtdrodadas++;
        qtdRodadas.save();
        await DoubleData.create({
          cor: 2,
          createdAt: date,
        });
        break;
      default:
        console.log("Cor não conhecida");
        await DoubleData.create({
          cor: -1,
        });
        break;
    }
  }
});

socket.on("connect_error", (err) => {
  console.log("Erro ao se conectar com o socket", err);
});

/*=========================== VERSÃO RODANDO COM WEBSOCKET   =============================*/ 



/*=========================== VERSÃO RODANDO COM NAVEGADOR EM MEMÓRIA   =============================*/ 

// (async () => {
//   const browser = await puppeteer.launch({
//     headless: true, // The browser is visible
//     ignoreHTTPSErrors: true,
//     args: [`--window-size=${1920},${1080}`], // new option
//     defaultViewport: {
//       width:1280,
//       height:920
//     }
//   });
//   const page = await browser.newPage();
//   await page.goto('https://blaze.com/pt/games/double');
//   // await page.screenshot({ path: 'example.png' });

//   await page.exposeFunction('puppeteerLogMutation', async (result) => {

//     let date = moment().locale('pt-BR').format()
//     switch (data.payload.color){
//       case 0:
//         console.log(String.fromCodePoint(0x26AA), 'Branco')
//         let rodadas = ++qtdRodadas.qtdrodadas
//         qtdRodadas.qtdrodadas = 0
//         qtdRodadas.save();
//         await DoubleData.create({
//           cor: 0,
//           createdAt: date
//         })
//         await RodadasParaBranco.create({
//           qtdrodadas: rodadas
//         })
//         break;
//       case 1:
//         console.log(String.fromCodePoint(0X1F534), 'Vermelho');
//         qtdRodadas.qtdrodadas++
//         qtdRodadas.save();
//         await DoubleData.create({
//           cor: 1,
//           createdAt: date
//         })
//         break;
//       case 2:
//         console.log(String.fromCodePoint(0X26AB),'Preto');
//         qtdRodadas.qtdrodadas++
//         qtdRodadas.save();
//         await DoubleData.create({
//           cor: 2,
//           createdAt: date
//         })
//         break;
//       default:
//         console.log('Cor não conhecida')
//         await DoubleData.create({
//           cor: -1
//         })
//         break;
//     }

//     // let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
//     // let month = (date.getMonth() + 1)< 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
//     // let year = date.getFullYear();
//     // let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
//     // let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
//     // let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
//     setTimeout(() => {
//       page.screenshot({
//         path: `./screenshots/double_${result}_${moment().locale('pt-BR').format('DD-MM-YYYY hh-mm-ss')}.png` }
//       )
//     }, 1000);
//     // console.log(result)
//   });
//   const dimensions = await page.evaluate(() => {

//     const observer = new MutationObserver( mutations => {
//       puppeteerLogMutation([
//         ...document.querySelector("#roulette-recent .roulette-previous .entries").childNodes[0].childNodes[0].childNodes[0].classList
//       ][1]);

//     });
//     observer.observe(document.querySelector(".roulette-previous .entries"), { childList: true,
//       });
//   })
// })();

/*=========================== VERSÃO RODANDO COM NAVEGADOR EM MEMÓRIA   =============================*/ 