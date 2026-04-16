console.log("SCRIPT LOADED");
console.log("FORM", document.getElementById("transaction-form"));
const form = document.getElementById('transaction-form');
const balance = document.getElementById('balance');
const list = document.getElementById('list');
const searchInput = document.getElementById('search');
const submitBtn = document.getElementById('submit-btn');
let editingId = null;
let chartMode='overview';
let monthlyBudget= parseFloat(localStorage.getItem('monthlyBudget'))
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Perhpas this will fix update UI cal


const ctx = document.getElementById('myChart').getContext('2d');
const chart = new Chart(ctx, {
type: 'doughnut',

data:{

labels: ['Income', 'Expenses'],
datasets: [{
data: [0,0],

    backgroundColor: ['rgba(0, 212, 255, 0.7)', 'rgba(255, 45, 120, 0.7)'],
borderColor: ['#00d4ff', '#ff2d78'],
borderWidth: 2
}]



},


options: {
responsive: true,
maintainAspectRatio: false,
cutout: '68%',
plugins: {
legend: { labels: { color: '#8a7aaa', font: { family: "'Share Tech Mono'"},
size: 11}, boxWidth: 12},
tooltip: { callbacks: { label: ctx => ` $${ctx.parsed.toFixed(2)}` } }

},


}


});

updateUI();










form.addEventListener('submit', function(e){

e.preventDefault();
const desc = document.getElementById('desc').value;

const amount = Number(document.getElementById('amount').value);
const type= document.getElementById('type').value;
const category = document.getElementById('category').value;





if(editingId !== null)
{
    transactions = transactions.map(t => t.id === editingId ? { id: editingId, desc, amount, type, category, date: t.date} : t)
editingId = null;
submitBtn.textContent='Add';
}

else{
const transaction = { id: Date.now(), desc, amount, type, category, date: new Date().toISOString() };
transactions.push(transaction);
}












updateUI();});

// UPDATE UI FUNCTION IS HEREEEEE

    function updateUI(){
        list.innerHTML = '';
    let total = 0;

    let totalIncome = 0;
    let totalExpense = 0;


    transactions.forEach(t => {
const li = document.createElement('li');
li.classList.add(t.type);
li.innerHTML=`<span class="tx-desc">${t.desc} <span class="tx-cat">[${t.category || 'Other'}]</span></span><span class="tx-date">${t.date || ''}</span><span class="tx-amount">${t.type === 'income' ? '+' : '-'}$${Number(t.amount).toFixed(2)}</span><button class="tx-edit" onclick="editTransaction(${t.id})">✎</button><button class="tx-delete" onclick="deleteTransaction(${t.id}, this.parentElement)">✕</button>`;

list.appendChild(li);

    total += t.type === 'income' ? t.amount : -t.amount;

if( t.type === 'income') totalIncome += t.amount;
if (t.type === 'expense') totalExpense += t.amount;
    })


// balance stuf

    balance.textContent = total < 0 ? `-$${Math.abs(total).toFixed(2)}`: `$${total.toFixed(2)}`;


balance.className = total >= 0 ? 'positive' : 'negative';
document.getElementById('total-income').textContent = `$${totalIncome.toFixed(2)}`;

document.getElementById('total-expense').textContent = `$${totalExpense.toFixed(2)}`;
document.getElementById('tx-count').textContent 
= `${transactions.length} ENTR${transactions.length === 1 ? 'Y' : 'IES'}`;

if (!chart) return;
updateChart(totalIncome, totalExpense);


localStorage.setItem('transactions', JSON.stringify(transactions));
 updateMonthlySummary();

}


 



// for delteing the transactions

    function deleteTransaction(id, li){
li.style.opacity ='0'
li.style.transition = 'opacity 0.25s, transform 0.25s'
li.style.transform = 'translateX(20px)';
setTimeout(() => {
transactions = transactions.filter(t => t.id !== id);
updateUI();


}, 250);

}

function editTransaction(id)
{
    const t = transactions.find(t => t.id ===id);
    document.getElementById('desc').value = t.desc;
    document.getElementById ('amount').value=t.amount;
    
    document.getElementById('type').value= t.type;
    document.getElementById('category').value=t.category || 'Other';
    
    
    editingId = id;
    submitBtn.textContent = "Update";
}









// filter for searching liver transactions

searchInput.addEventListener('input', function(){

const term = searchInput.value.toLowerCase();
document.querySelectorAll('#list li').forEach(li => {
const desc = li.querySelector('.tx-desc').textContent.toLowerCase();
li.style.display= desc.includes(term) ? 'flex' : 'none';


});



}


);


function switchChart(mode){
chartMode=mode;
document.getElementById('btn-overview').classList.toggle('active', mode === 'overview');
document.getElementById('btn-category').classList.toggle('active', mode === 'category');
updateChart();
}

function updateChart()
{
if (!chart) return;
if (chartMode === 'overview')
{
const totalIncome = transactions.filter(t=>t.type==='income').reduce((sum, t)=> sum + t.amount, 0);
const totalExpense = transactions.filter ( t=> t.type === 'expense').reduce((sum,t)=> sum+t.amount, 0);
chart.data.labels=['Income', 'Expenses'];
chart.data.datasets[0].data=[totalIncome,totalExpense];
chart.data.datasets[0].backgroundColor =['rgba(0,212,255,0.7)', 'rgba(255, 45,120,0.7)'];
chart.data.datasets[0].borderColor=['#00d4ff', '#ff2d78'];
}

if(chartMode==='category'){
    const categories=['Food', 'Bills', 'Shopping', 'School', 'Other'];
    const totals =categories.map(cat => transactions.filter(t => t.type === 'expense' && t.category === cat).reduce((sum, t) => sum + t.amount, 0));
chart.data.labels=categories;
chart.data.datasets[0].data =totals;
chart.data.datasets[0].backgroundColor = ['rgba(255,45,120,0.7)', 'rgba(177, 79, 255,0.7)', 'rgba(0,212, 255, 0.7)','rgba( 255, 190, 50, 0.7)', 'rgba(100,255, 180, 0.7)'];
chart.data.datasets[0].borderColor = ['#ff2d78', '#b14fff', '#00d4ff', '#ffbe32', "#64ffb4"];

}

chart.update();
}


function updateMonthlySummary()
{

    const now=new Date();
const thisMonth= now.getMonth();
const thisYear = now.getFullYear();
const monthlyExpenses = transactions.filter(t =>{
const d = new Date(t.date);
const valid = !isNaN(d.getTime()); 
return t.type === 'expense' && valid && d.getMonth() === thisMonth && d.getFullYear() === thisYear;
}).reduce((sum, t) => sum + t.amount, 0);

const monthlyIncome = transactions.filter(t => {
const d = new Date(t.date);
const valid = !isNaN(d.getTime());
return t.type === 'income' && valid && d.getMonth() === thisMonth && d.getFullYear() === thisYear;

}).reduce((sum, t) => sum + t.amount, 0);
const monthName = now.toLocaleString('default', {month: 'long' });
document.getElementById('monthly-text').textContent = `${monthName}: +$${monthlyIncome.toFixed(2)} income . -$${monthlyExpenses.toFixed(2)} spent`;
checkBudgetWarning(monthlyExpenses);
}


function setBudget()
{
const val=parseFloat(document.getElementById(`budget-input`).value);
if(isNaN(val)|| val<= 0) return;
monthlyBudget=val;
localStorage.setItem(`monthlyBudget`, val)
document.getElementById('budget-input').value='';
updateMonthlySummary();
}




function checkBudgetWarning(spent)
{
const warning =document.getElementById('budget-warning');
if(!monthlyBudget)
{
    warning.style.display='none'; return;
}
const pct = (spent/monthlyBudget)*100;
warning.style.display='block';
if (pct>=100)
{
    warning.textContent =`⚠ BUDGET EXCEEDED - $${spent.toFixed(2)} of $${monthlyBudget.toFixed(2)} spent`;
warning.className= 'budget-danger';
}
else if (pct>=80)
{
warning.textContent=`⚠ BUDGET WARNING - $${spent.toFixed(2)} of $${monthlyBudget.toFixed(2)} spent(${Math.round(pct)}%)`;
warning.className='budget-warn';
}
else{
warning.textContent=`BUDGET OK - $${spent.toFixed(2)} of $${monthlyBudget.toFixed(2)} spent (${Math.round(pct)}%)`;

warning.className ='budget-ok';
}




}