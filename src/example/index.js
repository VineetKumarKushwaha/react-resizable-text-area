// @flow
import React from "react";
import ReactDOM from "react-dom";
import RichTextInput from "../component";

// const str =   "Top 20 Songs of Atif Aslam: 01.Dil Diyan Gallan 02.O Saathi 04.Piya O RE Piya03.Tere Sang Yaara05.Pehli Dafa06.Jeena Jeena07.Main Rang Sharbaton ka08.Kuch Is Tarah";
// const str = "This is test messag with some random words jakjkj akja kjjkk kjak jkak kjkjjk jka kja kkj kjkj ak kja";
// const str = `sdfdsffds;
// sddssdfds
// sdfdsfds`;

const html = 'This is test messag with some random wor<span style="background-color: rgb(175, 81, 81);"><font color="#7ed321">ds jakjkj akja kjjkk kjak jkak kjkjjk</font></span> jka kja kkj kjkj ak kja';

const app = document.getElementById("app");
const node = document.createElement("div");
if (app) {
    setTimeout(() => {
       ReactDOM.render(<RichTextInput text={html} width={329} fontSize={21.7} top={11} left={44} getHTML={html=> {
        node.innerHTML = html;
        app.appendChild(node);
       }}/>, app); 
    }, 1000);
}