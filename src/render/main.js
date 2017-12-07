
import React from 'react';
import ReactDOM from 'react-dom'; 
import PersonalCard from './js/components/PersonalCard';
import Fs from 'fs';

/**
 * 利用NodeJS的FS來存取檔案，但是其實應該這段要寫在後端(core)
 * 之後可以利用Electron的IPC來去達到前後端溝通的功能，像讀寫檔案這種檔案處理應該要寫在後端
 */
let personData = Fs.readFileSync( './assets/person.json' );
personData = JSON.parse( personData );

// Create and push react component to array
let componentAry = [];
Object.keys(personData).forEach( (key) => {
    componentAry.push( <PersonalCard key={key} personData={personData[key]} /> );
});

let mainStyle = {
    padding: '10px'
}

ReactDOM.render((
    <div className="ui link cards" style={mainStyle} >
        {componentAry}
    </div>
), document.getElementById('main'));
