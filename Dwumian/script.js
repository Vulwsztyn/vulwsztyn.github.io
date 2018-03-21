class Simulation {
    constructor(CA0, k, tau,T, iloscKrokow){
    this.CA = [[CA0],[0]];
    this.CB=[[0],[0]];
    this.k = k;
    this.tau = tau;
    this.T=T;

    this.iloscKrokow=iloscKrokow;
    this.h=T/iloscKrokow;
    this.wygenerowane=1;
}

deltaC(C1,C2,minus,zero){
    return (C1-zero*C2)/this.tau-minus*this.k*C2;
}

 Runge(C1,C2,minus,zero,ktory){
    if (typeof zero === 'undefined') { zero = 1; }
    if (typeof minus === 'undefined') { minus = 1; }
    if (typeof ktory === 'undefined') { ktory = 2; }

     let k1 = this.deltaC(C1, C2, minus, zero);
     let k2 = this.deltaC(C1 + this.h / 2, C2 + this.h * k1 / 2, minus, zero);
     let k3 = this.deltaC(C1 + this.h / 2, C2 + this.h * k2 / 2, minus, zero);
     let k4 = this.deltaC(C1 + this.h, C2 + this.h * k3, minus, zero);
     if (ktory===2){
        return C2+this.h/6*(k1+2*k2+2*k3+k4);
    }
    else{
        return C1+this.h/6*(k1+2*k2+2*k3+k4);
    }
}

RungeKutta(i){
    this.CA[0][i]=(this.Runge(this.CA[0][0],this.CA[0][i-1]));
    this.CB[0][i]=(this.Runge(this.CB[0][i-1],this.CA[0][i-1],-1,0,1));
    this.CA[1][i]=(this.Runge(this.CA[0][i-1],this.CA[1][i-1]));
    this.CB[1][i]=(this.Runge(this.CB[0][i-1],this.CB[1][i-1],-1));
}
Adams(C1,A1,i,minus,zero,ktory){
    if (typeof zero === 'undefined') { zero = 1; }
    if (typeof minus === 'undefined') { minus = 1; }
    if (typeof ktory === 'undefined') { ktory = 2; }
    let ky=[];
    for (let j=0;j<4;j++){
        ky[j]=this.deltaC(C1[i-1-j],A1[i-j-1],minus,zero);
    }
    let wspolczynniki=[55/24,-59/24,37/24,-9/24];
    let coDodac=0;
    for (let j=0;j<4;j++){
        coDodac+=wspolczynniki[j]*ky[j];
    }
    coDodac*=this.h;
    if (ktory===2){
        return A1[i-1]+coDodac;
    }
    else{
        return C1[i-1]+coDodac;
    }
}
AdamsBashfort(i){
    this.CA[0][i]=(this.Adams(this.CA[0],this.CA[0],i));
    this.CB[0][i]=(this.Adams(this.CB[0],this.CA[0],i,-1,0,1));
    this.CA[1][i]=(this.Adams(this.CA[0],this.CA[1],i));
    this.CB[1][i]=(this.Adams(this.CB[0],this.CB[1],i,-1));
}

runguj(j){
    for(let i=this.wygenerowane; i<j; i++){
        this.RungeKutta(i);
    }
    this.wygenerowane=j;
}
adamsuj(j){
    for(let i=this.wygenerowane; i<j; i++){
        this.AdamsBashfort(i);
    }
    this.wygenerowane=j;
}

    wypis(){
    console.log(this.CA[0]);
        console.log(this.CA[1]);
        console.log(this.CB[0]);
        console.log(this.CB[1]);
    }
}

function init() {
    let symulacja= new Simulation(5,0.12,5,4,5000);
    symulacja.runguj(4);
    symulacja.adamsuj(symulacja.iloscKrokow);
    symulacja.wypis();
    var options = {
        chart: {
            title: 'Adams-Bashfort'
        },
        width: 900,
        height: 500,
        axes: {
            x: {
                0: {side: 'top'}
            }
        }
    };
    var options2 = {
        chart: {
            title: 'Adams-Bashfort'
        },
        width: 900,
        height: 500,
        axes: {
            x: {
                0: {side: 'top'}
            }
        }
    };
    var data = new google.visualization.DataTable();
    var data2 = new google.visualization.DataTable();
    let chart = new google.charts.Line(document.getElementById('Wykres1'));
    let chart2 = new google.charts.Line(document.getElementById('Wykres2'));
    let button = document.getElementById('but');

    function drawChart() {
        // Disabling the button while the chart is drawing.
        button.disabled = true;
        google.visualization.events.addListener(chart, 'ready',
            function() {
                button.disabled = false;
            });
        console.log("adolf");
        chart.draw(data, google.charts.Line.convertOptions(options));
        chart2.draw(data2, google.charts.Line.convertOptions(options2));
    }
    function Klik(){
        let ca0 = parseInt(document.getElementById('CA0').value);
        let k = parseFloat(document.getElementById('k').value);
        let T = parseInt(document.getElementById('T').value);
        let tau = parseInt(document.getElementById('tau').value);
        let iK = parseInt(document.getElementById('iloscKrokow').value);
        let sym= new Simulation(ca0,k,tau,T,iK);
        let sym2= new Simulation(ca0,k,tau,T,iK);
        sym.runguj(4);
        sym.adamsuj(sym.iloscKrokow);
        sym2.runguj(sym.iloscKrokow);
        data = new google.visualization.DataTable();
        data.addColumn('number', 'Czas');
        data.addColumn('number', 'CA1');
        data.addColumn('number', 'CB1');
        data.addColumn('number', 'CA2');
        data.addColumn('number', 'CB2');
        data2 = new google.visualization.DataTable();
        data2.addColumn('number', 'Czas');
        data2.addColumn('number', 'CA1');
        data2.addColumn('number', 'CB1');
        data2.addColumn('number', 'CA2');
        data2.addColumn('number', 'CB2');
        for(let i=0; i<sym.iloscKrokow; i++) {
            data.addRows([
                [i * sym.h, sym.CA[0][i], sym.CB[0][i], sym.CA[1][i], sym.CB[1][i]]
            ]);
            data2.addRows([
                [i * sym2.h, sym2.CA[0][i], sym2.CB[0][i], sym2.CA[1][i], sym2.CB[1][i]]
            ]);
        }
        drawChart();
    };
    button.onclick = Klik();
    Klik();
}
google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(init);

