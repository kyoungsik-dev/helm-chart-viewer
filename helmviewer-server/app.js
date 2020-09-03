const express = require('express');
const path = require('path');
const schedule = require('node-schedule');
const dirTree = require("directory-tree");
const { exec } = require('child_process');
const app = express();

treeRouter = express.Router()
const frontAppLocation = '../helmviewer/build/';
const PORT = 3000;
let log = [];

app.use(express.static(frontAppLocation));
app.use('/chart/tree', treeRouter)
treeRouter.get('/:id', (req, res) => {
    const tree = dirTree(`./charts/stable/${req.params.id}`);
    if (!tree) {
        console.log(404)
        res.status(404).send('<h1>404 NOT FOUND</h1>');
    }
    res.json(tree);
})
app.use('/chart/list', (req, res) => {
    const tree = dirTree('./charts/stable');
    list = tree.children.map(item => item.name);
    res.json(list);
})
app.use('/chart/file', express.static('./charts/stable', {dotfiles:'allow'} ))
app.get('/log', function(req, res){
    res.send(`<h3>Last Update : ${log[log.length-1]}</h3> ${log.join('<br />')}`);
})
app.get('*', function(req, res) {
    res.sendFile('index.html', {root: path.join(__dirname, frontAppLocation)});
});
app.listen(PORT, function(){
    // const fetchChart = () => {
    //     exec('cd charts && git fetch', (err, stdout, stderr) => {
    //         if (err) {
    //             console.error(err)
    //         } else {
    //             log.push(`${new Date().toLocaleString('ko-KR', {timeZone:'Asia/Seoul'})} : ${stdout} :${stderr}`);
    //         }
    //     });
    // }
    // const scheduler = schedule.scheduleJob('*/10 * * * * *', fetchChart);
    console.log(`Conneted ${PORT} port!`);
});