
const RichTextInput = window.RichTextInput.default;

const app = document.getElementById("app");
// const str =   "Top 20 Songs of Atif Aslam: 01.Dil Diyan Gallan 02.O Saathi 04.Piya O RE Piya03.Tere Sang Yaara05.Pehli Dafa06.Jeena Jeena07.Main Rang Sharbaton ka08.Kuch Is Tarah";
const str = "This is test messag with some random words jakjkj akja kjjkk kjak jkak kjkjjk jka kja kkj kjkj ak kja";
// const str = `sdfdsffds;
// sddssdfds
// sdfdsfds`;

setTimeout(() => {
            if (app)
        window.ReactDOM.render(<RichTextInput text={str} fontSize={50} top={100} left={100}/>, app);
        }, 1000);
