class Simulation {
    constructor(CA0, k, tau,T, iloscKrokow){
    this.CA0=CA0;
    this.CA0s=[];
    this.CA = [[0],[0]];
    this.CB=[[0],[0]];
    this.dCA = [[0],[0]];
    this.dCB=[[0],[0]];
    this.k = k;
    this.tau = tau;
    this.T=T;

    this.iloscKrokow=iloscKrokow;
    this.h=this.T/iloscKrokow;
    this.wygenerowane=1;

    for(let i=0;i<iloscKrokow;i++){
        this.CA0s[i]=CA0;
    }
}

deltaC(C1,C2,plus,zero){
    return (C1-zero*C2)/this.tau+plus*this.k*C2;
}

 Runge(C1,C2,plus,zero){
     let k1 = this.deltaC(C1, C2, plus, zero);
     let k2 = this.deltaC(C1 + this.h / 2, C2 + k1 / 2, plus, zero);
     let k3 = this.deltaC(C1 + this.h / 2, C2 +  k2 / 2, plus, zero);
     let k4 = this.deltaC(C1 + this.h, C2 + k3, plus, zero);

     return this.h/6*(k1+2*k2+2*k3+k4);
}

Adams(C1,A1,i,plus,zero){
    let ky=[];
    for (let j=0;j<4;j++){
        ky[j]=this.deltaC(C1[i-1-j],A1[i-j-1],plus,zero);
    }
    let wspolczynniki=[55/24,-59/24,37/24,-9/24];
    let coDodac=0;
    for (let j=0;j<4;j++){
        coDodac+=wspolczynniki[j]*ky[j];
    }
    return coDodac*this.h;
}

RungeKutta(i){
    this.dCA[0][i]=(this.Runge(this.CA0,this.CA[0][i-1],-1,1));
    this.dCB[0][i]=(this.Runge(this.CB[0][i-1],this.CA[0][i-1],1,0));
    this.dCA[1][i]=(this.Runge(this.CA[0][i-1],this.CA[1][i-1],-1,1));
    this.dCB[1][i]=(this.Runge(this.CB[0][i-1],this.CB[1][i-1],1,1));

    this.CA[0][i]=this.CA[0][i-1]+this.dCA[0][i];
    this.CB[0][i]=this.CB[0][i-1]+this.dCB[0][i];
    this.CA[1][i]=this.CA[1][i-1]+this.dCA[1][i];
    this.CB[1][i]=this.CB[1][i-1]+this.dCB[1][i];
}

AdamsBashfort(i){
    this.dCA[0][i]=(this.Adams(this.CA0s,this.CA[0],i,-1,1));
    this.dCB[0][i]=(this.Adams(this.CB[0],this.CA[0],i,1,0));
    this.dCA[1][i]=(this.Adams(this.CA[0],this.CA[1],i,-1,1));
    this.dCB[1][i]=(this.Adams(this.CB[0],this.CB[1],i,1,1));

    this.CA[0][i]=this.CA[0][i-1]+this.dCA[0][i];
    this.CB[0][i]=this.CB[0][i-1]+this.dCB[0][i];
    this.CA[1][i]=this.CA[1][i-1]+this.dCA[1][i];
    this.CB[1][i]=this.CB[1][i-1]+this.dCB[1][i];
}

runguj(j){
    for(let i=this.wygenerowane; i<j; i++){
        this.RungeKutta(i);
    }
    if(j>this.wygenerowane) this.wygenerowane=j;

    this.dCA[0][0]=this.dCA[0][1];
    this.dCB[0][0]=this.dCB[0][1];
    this.dCA[1][0]=this.dCA[1][1];
    this.dCB[1][0]=this.dCB[1][1];
}
adamsuj(j){
    for(let i=this.wygenerowane; i<j; i++){
        this.AdamsBashfort(i);
    }
    if(j>this.wygenerowane) this.wygenerowane=j;

    this.dCA[0][0]=this.dCA[0][1];
    this.dCB[0][0]=this.dCB[0][1];
    this.dCA[1][0]=this.dCA[1][1];
    this.dCB[1][0]=this.dCB[1][1];
}

    wypis(){
    console.log(this.CA[0]);
        console.log(this.CA[1]);
        console.log(this.CB[0]);
        console.log(this.CB[1]);
    }
}

function init() {
    var ileChartow=10;

    var data=[];
    var options=[];
    var chart=[];
    for(let i=0;i<ileChartow;i++){
         options[i] = {
            chart: {
                title: 'Adams-Bashfort łącznie'
            },
            width: 900,
            height: 500,
            axes: {
                x: {
                    0: {side: 'bottom'}
                }
            },
             animation:{
                 duration: 1000,
                 easing: 'out',
             },
             vAxis: {
                 title: 'Stężenie [mol/litr]'
             }
        };
         let nazwa='Wykres'+i;
        chart[i] = new google.charts.Line(document.getElementById(nazwa));
    }

    options[2].chart.title='Adams-Bashfort osobno 1';
    options[4].chart.title='Adams-Bashfort osobno 2';
    options[6].chart.title='Adams-Bashfort osobno 2 skala ta co w reszcie';
    options[1].chart.title='Runge-Kutta łącznie';
    options[3].chart.title='Runge-Kutta osobno 1';
    options[5].chart.title='Runge-Kutta osobno 2';
    options[7].chart.title='Runge-Kutta osobno 2 skala ta co w reszcie';
    options[8].chart.title='Runge-Kutta Delty';
    options[9].chart.title='Adams-Bashfort Delty';
    options[6].vAxis.viewWindow={};
    options[7].vAxis.viewWindow={};
    options[6].vAxis.viewWindow.max=parseInt(document.getElementById('CA0').value);
    options[7].vAxis.viewWindow.max=parseInt(document.getElementById('CA0').value);

    var button = document.getElementById('but');

    function drawChart() {
       for(let i=0;i<ileChartow;i++) {
           chart[i].draw(data[i], google.charts.Line.convertOptions(options[i]));
       }

    }
    function Klik(){
        ileChartow=ileChartow+2*2-4;
        let ca0 = parseFloat(document.getElementById('CA0').value);
        let k = parseFloat(document.getElementById('k').value);
        let T = parseFloat(document.getElementById('T').value);
        let tau = parseFloat(document.getElementById('tau').value);
        let iK = parseInt(document.getElementById('iloscKrokow').value);
        let sym= new Simulation(ca0,k,tau,T,iK);
        let sym2= new Simulation(ca0,k,tau,T,iK);
        sym.runguj(4);
        sym.adamsuj(sym.iloscKrokow);
        sym2.runguj(sym.iloscKrokow);
        let  opisOsiX="Czas [min]";
        for(let i=0;i<ileChartow;i++) {
            data[i] = new google.visualization.DataTable();
            data[i].addColumn('number', opisOsiX);
        }
        for(let i=0;i<2;i++){
            let j=i;
            data[j].addColumn('number', 'CA1');
            data[j].addColumn('number', 'CB1');
            data[j].addColumn('number', 'CA2');
            data[j].addColumn('number', 'CB2');
            j=i+2;
            data[j].addColumn('number', 'CA1');
            data[j].addColumn('number', 'CB1');
            j=i+4;
            data[j].addColumn('number', 'CA2');
            data[j].addColumn('number', 'CB2');
            j=i+6;
            data[j].addColumn('number', 'CA2');
            data[j].addColumn('number', 'CB2');
            j=i+8;
            data[j].addColumn('number', 'dCA1');
            data[j].addColumn('number', 'dCB1');
            data[j].addColumn('number', 'dCA2');
            data[j].addColumn('number', 'dCB2');
        }


        for(let i=0; i<sym.iloscKrokow; i++) {
            data[0].addRows([
                [i * sym.h, sym.CA[0][i], sym.CB[0][i], sym.CA[1][i], sym.CB[1][i]]
            ]);
            data[1].addRows([
                [i * sym2.h, sym2.CA[0][i], sym2.CB[0][i], sym2.CA[1][i], sym2.CB[1][i]]
            ]);
            data[2].addRows([
                [i * sym.h, sym.CA[0][i], sym.CB[0][i]]
            ]);
            data[3].addRows([
                [i * sym2.h, sym2.CA[0][i], sym2.CB[0][i]]
            ]);
            data[4].addRows([
                [i * sym.h, sym.CA[1][i], sym.CB[1][i]]
            ]);
            data[5].addRows([
                [i * sym2.h, sym2.CA[1][i], sym2.CB[1][i]]
            ]);
            data[6].addRows([
                [i * sym.h,sym.CA[1][i], sym.CB[1][i]]
            ]);
            data[7].addRows([
                [i * sym2.h,sym2.CA[1][i], sym2.CB[1][i]]
            ]);
            data[8].addRows([
                [i * sym.h, sym2.dCA[0][i], sym2.dCB[0][i], sym2.dCA[1][i], sym2.dCB[1][i]]
            ]);
            data[9].addRows([
                [i * sym.h, sym.dCA[0][i], sym.dCB[0][i], sym.dCA[1][i], sym.dCB[1][i]]
            ]);
        }
        drawChart();
    }
    button.onclick = function() {
        Klik();
    };
}
google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(init);


